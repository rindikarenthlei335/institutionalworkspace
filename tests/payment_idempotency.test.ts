import test from 'node:test';
import assert from 'node:assert/strict';

export interface ProcessedPayment {
  idempotencyKey: string;
  orderId: string;
  amountPaise: number;
  status: 'success' | 'failed';
  processedAt: string;
}

export class PaymentProcessor {
  private processedKeys = new Map<string, ProcessedPayment>();

  async processWebhookEvent(event: {
    idempotencyKey: string;
    orderId: string;
    amountPaise: number;
  }): Promise<{ isDuplicate: boolean; payment: ProcessedPayment }> {
    if (this.processedKeys.has(event.idempotencyKey)) {
      // Duplicate event detected: Return existing record without re-processing
      return {
        isDuplicate: true,
        payment: this.processedKeys.get(event.idempotencyKey)!
      };
    }

    // Process new payment
    const newPayment: ProcessedPayment = {
      idempotencyKey: event.idempotencyKey,
      orderId: event.orderId,
      amountPaise: event.amountPaise,
      status: 'success',
      processedAt: new Date().toISOString()
    };

    this.processedKeys.set(event.idempotencyKey, newPayment);

    return {
      isDuplicate: false,
      payment: newPayment
    };
  }

  getProcessedCount(): number {
    return this.processedKeys.size;
  }
}

test('Payment Idempotency: Duplicate webhook events are deduplicated safely', async () => {
  const processor = new PaymentProcessor();

  const webhookPayload = {
    idempotencyKey: 'idemp_rzp_pay_99881122',
    orderId: 'order_1234567',
    amountPaise: 420000
  };

  // First webhook delivery
  const res1 = await processor.processWebhookEvent(webhookPayload);
  assert.equal(res1.isDuplicate, false);
  assert.equal(res1.payment.status, 'success');
  assert.equal(processor.getProcessedCount(), 1);

  // Duplicate webhook delivery (e.g. network retry from Razorpay)
  const res2 = await processor.processWebhookEvent(webhookPayload);
  assert.equal(res2.isDuplicate, true);
  assert.equal(res2.payment.orderId, 'order_1234567');
  assert.equal(processor.getProcessedCount(), 1); // Counter did not double-increment!

  // Distinct payment event
  const res3 = await processor.processWebhookEvent({
    idempotencyKey: 'idemp_rzp_pay_44332211',
    orderId: 'order_7654321',
    amountPaise: 750000
  });
  assert.equal(res3.isDuplicate, false);
  assert.equal(processor.getProcessedCount(), 2);
});
