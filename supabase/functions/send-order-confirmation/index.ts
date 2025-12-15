import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");



const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderItem {
  product_name: string;
  quantity: number;
  product_price: number;
  total: number;
}

interface OrderConfirmationRequest {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  shippingCity: string;
  paymentMethod: string;
  subtotal: number;
  shippingCost: number;
  total: number;
  estimatedDelivery: string;
  items: OrderItem[];
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Received request to send order confirmation email");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const orderData: OrderConfirmationRequest = await req.json();
    console.log("Order data received:", JSON.stringify(orderData, null, 2));

    const paymentMethodLabel = orderData.paymentMethod === 'cash_on_delivery' 
      ? 'الدفع عند الاستلام' 
      : 'تحويل بنكي';

    const itemsHtml = orderData.items.map(item => `
      <tr style="border-bottom: 1px solid #e5e5e5;">
        <td style="padding: 12px; text-align: right;">${item.product_name}</td>
        <td style="padding: 12px; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px; text-align: left;">${Number(item.product_price).toFixed(2)} ج.م</td>
        <td style="padding: 12px; text-align: left;">${Number(item.total).toFixed(2)} ج.م</td>
      </tr>
    `).join('');

    const emailHtml = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; direction: rtl;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">
            MK<span style="color: #f59e0b;">.</span>STORE
          </h1>
          <p style="color: #e5e5e5; margin-top: 10px; font-size: 14px;">شكراً لتسوقك معنا!</p>
        </div>

        <!-- Order Confirmation -->
        <div style="padding: 30px;">
          <div style="background-color: #dcfce7; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 30px;">
            <p style="color: #166534; font-size: 18px; font-weight: bold; margin: 0;">
              ✓ تم تأكيد طلبك بنجاح
            </p>
            <p style="color: #166534; font-size: 14px; margin-top: 8px;">
              رقم الطلب: <strong>#${orderData.orderId.slice(0, 8).toUpperCase()}</strong>
            </p>
          </div>

          <h2 style="color: #1a1a2e; font-size: 18px; margin-bottom: 15px; border-bottom: 2px solid #f59e0b; padding-bottom: 10px;">
            مرحباً ${orderData.customerName}! 👋
          </h2>
          <p style="color: #525252; line-height: 1.8; margin-bottom: 25px;">
            نشكرك على ثقتك في MK Store. تم استلام طلبك بنجاح وسيتم تجهيزه في أقرب وقت ممكن.
          </p>

          <!-- Order Items -->
          <h3 style="color: #1a1a2e; font-size: 16px; margin-bottom: 15px;">تفاصيل الطلب:</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; background-color: #fafafa; border-radius: 8px; overflow: hidden;">
            <thead>
              <tr style="background-color: #1a1a2e; color: #ffffff;">
                <th style="padding: 12px; text-align: right;">المنتج</th>
                <th style="padding: 12px; text-align: center;">الكمية</th>
                <th style="padding: 12px; text-align: left;">السعر</th>
                <th style="padding: 12px; text-align: left;">الإجمالي</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <!-- Order Summary -->
          <div style="background-color: #fafafa; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <span style="color: #525252;">المجموع الفرعي:</span>
              <span style="color: #1a1a2e;">${Number(orderData.subtotal).toFixed(2)} ج.م</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <span style="color: #525252;">الشحن:</span>
              <span style="color: #1a1a2e;">${Number(orderData.shippingCost).toFixed(2)} ج.م</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding-top: 15px; border-top: 2px solid #e5e5e5;">
              <span style="color: #1a1a2e; font-weight: bold; font-size: 18px;">الإجمالي:</span>
              <span style="color: #f59e0b; font-weight: bold; font-size: 18px;">${Number(orderData.total).toFixed(2)} ج.م</span>
            </div>
          </div>

          <!-- Shipping Info -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px;">
            <div style="background-color: #fafafa; border-radius: 8px; padding: 15px;">
              <h4 style="color: #1a1a2e; margin: 0 0 10px 0; font-size: 14px;">📍 عنوان الشحن</h4>
              <p style="color: #525252; margin: 0; font-size: 13px; line-height: 1.6;">
                ${orderData.shippingAddress}<br>
                ${orderData.shippingCity}
              </p>
            </div>
            <div style="background-color: #fafafa; border-radius: 8px; padding: 15px;">
              <h4 style="color: #1a1a2e; margin: 0 0 10px 0; font-size: 14px;">💳 طريقة الدفع</h4>
              <p style="color: #525252; margin: 0; font-size: 13px;">${paymentMethodLabel}</p>
            </div>
          </div>

          <!-- Estimated Delivery -->
          <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 25px;">
            <p style="color: #92400e; margin: 0; font-size: 14px;">
              🚚 <strong>موعد التوصيل المتوقع:</strong> ${orderData.estimatedDelivery}
            </p>
          </div>

          <!-- Contact Info -->
          <p style="color: #737373; font-size: 13px; text-align: center; line-height: 1.8;">
            للاستفسارات، يمكنك التواصل معنا عبر:<br>
            📧 support@mkstore.com | 📱 ${orderData.customerPhone}
          </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #1a1a2e; padding: 25px; text-align: center;">
          <p style="color: #a3a3a3; margin: 0; font-size: 12px;">
            © 2024 MK Store. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </body>
    </html>
    `;

    console.log("Sending email to:", orderData.customerEmail);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "MK Store <onboarding@resend.dev>",
        to: [orderData.customerEmail],
        subject: `تأكيد طلبك #${orderData.orderId.slice(0, 8).toUpperCase()} - MK Store`,
        html: emailHtml,
      }),
    });

    if (!res.ok) {
      const errorData = await res.text();
      console.error("Resend API error:", errorData);
      throw new Error(`Failed to send email: ${errorData}`);
    }

    const emailResponse = await res.json();
    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending order confirmation email:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
