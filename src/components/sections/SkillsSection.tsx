type Skill = {
  id: string
  category: string
  title: string
  items: string
  order: number
  visible: boolean
}

type SkillsSectionProps = {
  data: Skill[]
}

export default async function SkillsSection({ data }: SkillsSectionProps) {
  return (
    <section id="skills" className="py-32 md:py-48 border-t border-border-subtle">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
          {data.map((skill, i) => (
            <div key={skill.id} className="reveal-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <p className="label text-text-muted mb-6">{skill.category}</p>
              <ul className="space-y-3">
                {skill.items.split('\n').map((item, j) => (
                  <li key={j} className="body-md text-text-primary">{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
