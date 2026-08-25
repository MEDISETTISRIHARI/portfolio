'use client'

import { FormEvent, useState } from 'react'
import {
  AdminShell,
  Area,
  Check,
  Field,
  Notice,
  SaveButton,
  emptySkill,
  useAdminData,
  SkillData,
} from '@/components/admin/AdminUI'

export default function SkillsAdmin() {
  const editor = useAdminData<SkillData[]>(
    'skills',
    []
  )

  const [editing, setEditing] =
    useState<SkillData | null>(null)

  function edit(item: SkillData) {
    setEditing({
      ...emptySkill,
      ...item,
      items: normalise(item.items),
    })
  }

  function normalise(value: unknown) {
    if (!value) return ''

    if (Array.isArray(value)) {
      return value.join(', ')
    }

    const text = String(value)

    try {
      const parsed = JSON.parse(text)

      if (Array.isArray(parsed)) {
        return parsed.join(', ')
      }
    } catch {}

    return text
  }

  async function submit(e: FormEvent) {
    e.preventDefault()

    if (!editing) return

    const ok = await editor.save({
      ...editing,
      items: editing.items
        .split(',')
        .map(x => x.trim())
        .filter(Boolean),
    })

    if (ok) {
      setEditing(null)
    }
  }

  async function remove(item: SkillData) {
    if (!item.id) return

    if (
      !window.confirm(
        `Delete "${item.title}"?`
      )
    ) {
      return
    }

    await editor.remove(item.id)
  }

  return (
    <AdminShell
      title="Skills"
      description="Manage your skills and categories."
    >
      <div className="space-y-6">

        <Notice
          error={editor.error}
          message={editor.message}
        />

        {!editing && (
          <>
            <button
              type="button"
              onClick={() =>
                setEditing({
                  ...emptySkill,
                  order: editor.data.length,
                })
              }
              className="w-full border border-white/20 bg-white px-5 py-4 text-sm font-medium text-black"
            >
              + ADD SKILL GROUP
            </button>

            {editor.data.map(item => (
              <div
                key={item.id}
                className="border border-white/10 p-6"
              >
                <p className="text-xs tracking-[0.2em] text-white/40">
                  {item.category}
                </p>

                <h2 className="mt-2 text-2xl">
                  {item.title}
                </h2>

                <p className="mt-3 text-sm text-white/50">
                  {normalise(item.items)}
                </p>

                <div className="mt-5 flex gap-3">
                  <button
                    type="button"
                    onClick={() => edit(item)}
                    className="border border-white/20 px-4 py-3 text-sm hover:bg-white hover:text-black"
                  >
                    EDIT
                  </button>

                  <button
                    type="button"
                    onClick={() => remove(item)}
                    className="border border-red-500/30 px-4 py-3 text-sm text-red-300"
                  >
                    DELETE
                  </button>
                </div>
              </div>
            ))}
          </>
        )}

        {editing && (
          <form
            onSubmit={submit}
            className="space-y-6"
          >
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="text-sm text-white/50 hover:text-white"
            >
              ← CANCEL
            </button>

            <Field
              label="Category"
              value={editing.category}
              onChange={v =>
                setEditing({
                  ...editing,
                  category: v,
                })
              }
              placeholder="Development"
            />

            <Field
              label="Title"
              value={editing.title}
              onChange={v =>
                setEditing({
                  ...editing,
                  title: v,
                })
              }
              placeholder="Full-Stack Development"
            />

            <Area
              label="Items"
              value={editing.items}
              onChange={v =>
                setEditing({
                  ...editing,
                  items: v,
                })
              }
              placeholder="React, Next.js, TypeScript, Node.js"
              rows={5}
            />

            <Field
              label="Order"
              type="number"
              value={editing.order}
              onChange={v =>
                setEditing({
                  ...editing,
                  order: Number(v || 0),
                })
              }
            />

            <Check
              label="Visible on portfolio"
              checked={editing.visible}
              onChange={v =>
                setEditing({
                  ...editing,
                  visible: v,
                })
              }
            />

            <Notice
              error={editor.error}
              message={editor.message}
            />

            <SaveButton saving={editor.saving}>
              SAVE SKILL GROUP
            </SaveButton>
          </form>
        )}
      </div>
    </AdminShell>
  )
}
