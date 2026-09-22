export default function AboutPage() {
  return (
    <InfoPage
      title="عن المتجر"
      body="متجر تجريبي مستقل لبيع الحقائب النسائية بمحتوى عربي وأصول أصلية."
    />
  );
}

function InfoPage({ title, body }: { title: string; body: string }) {
  return (
    <section className="container section page-head">
      <h1>{title}</h1>
      <p>{body}</p>
    </section>
  );
}
