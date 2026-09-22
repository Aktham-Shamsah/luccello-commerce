import { testimonials } from "@/lib/catalog";

export default function TestimonialsPage() {
  return (
    <section className="container section page-head">
      <h1>آراء العملاء</h1>
      <div className="testimonial-grid">
        {testimonials.map((testimonial) => (
          <figure key={testimonial.name}>
            <div>★★★★★</div>
            <blockquote>{testimonial.body}</blockquote>
            <figcaption>{testimonial.name}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
