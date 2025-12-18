import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
  try {
    const { planId, price, name, interval } = await req.json();

    // In a real app, you would look up the Stripe Price ID based on the planId
    // For this prototype, we'll create a checkout session with line_items data
    // Note: In production, you should always use pre-defined Price IDs for security
    
    const sessionParams: any = {
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'jpy',
            product_data: {
              name: name,
            },
            unit_amount: price,
            ...(interval ? {
              recurring: {
                interval: interval === '月' ? 'month' : 'year',
              },
            } : {}),
          },
          quantity: 1,
        },
      ],
      mode: interval ? 'subscription' : 'payment',
      success_url: `${req.headers.get('origin')}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/pricing`,
    };

    const session = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Stripe Checkout Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

