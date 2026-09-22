export default function CheckoutPage() {
  return (
    <section className="container section checkout">
      <h1>إتمام الطلب</h1>
      <form className="checkout-grid">
        <fieldset>
          <legend>بيانات التواصل</legend>
          <input className="field" placeholder="الاسم" />
          <input className="field" type="email" placeholder="البريد الإلكتروني" />
          <input className="field" placeholder="رقم الجوال" />
        </fieldset>
        <fieldset>
          <legend>العنوان والشحن</legend>
          <input className="field" placeholder="العنوان" />
          <input className="field" placeholder="المدينة" />
          <select className="field" defaultValue="standard">
            <option value="standard">شحن قياسي مجاني</option>
            <option value="express">شحن سريع</option>
          </select>
        </fieldset>
        <fieldset>
          <legend>القسيمة والدفع</legend>
          <input className="field" defaultValue="L10" placeholder="كود الخصم" />
          <label className="payment-option">
            <input type="radio" name="payment" defaultChecked /> دفع تجريبي آمن
          </label>
          <p className="muted">لن يتم الوثوق بأي حالة دفع من المتصفح؛ التأكيد يتم من الخادم.</p>
        </fieldset>
        <button className="btn btn-primary" type="submit">
          إنشاء طلب تجريبي
        </button>
      </form>
    </section>
  );
}
