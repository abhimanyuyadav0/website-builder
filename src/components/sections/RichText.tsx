interface RichTextProps {
  content: string
}

const RichText = ({ content }: RichTextProps) => {
  return (
    <section className="mx-auto max-w-3xl px-6 py-12">
      <div
        className="prose prose-slate max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </section>
  )
}

export default RichText

