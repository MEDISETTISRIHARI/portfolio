'use client'

import { FormEvent, useState } from 'react'
import {
  AdminShell,
  Area,
  Check,
  Field,
  Notice,
  SaveButton,
  emptyService,
  useAdminData,
  ServiceData,
} from '@/components/admin/AdminUI'

export default function ServicesAdmin() {
  const editor = useAdminData<ServiceData[]>(
    'services',
    []
  )

  const [editing, setEditing] =
    useState<ServiceData | null>(null)

  async function submit(e: FormEvent) {
    e.preventDefault()

    if (!editing) return

    const ok = await editor.save(editing)

    if (ok) {
      setEditing(null)
    }
  }

  async function remove(item: ServiceData) {
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
      title="Services"
      description="Manage the services shown on your portfolio."
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
                  ...emptyService,
                  order: editor.data.length,
                })
              }
              className="w-full border border-white/20 bg-white px-5 py-4 text-sm font-medium text-black"
            >
              + ADD SERVICE
            </button>

            {editor.data.length === 0 && (
              <div className="border border-white/10 p-8 text-center text-white/40">
                No services yet.
              </div>
            )}

            {editor.data.map(item => (
              <div
                key={item.id}
                className="border border-white/10 p-6"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:justify-between">
                  <div>
                    <h2 className="text-2xl">
                      {item.title}
                    </h2>

                    <p className="mt-3 text-white/50">
                      {item.desc}
                    </p>

                    <p className="mt-4 text-xs text-white/30">
                      {item.visible
                        ? 'VISIBLE'
                        : 'HIDDEN'}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setEditing(item)
                      }
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
              label="Title"
              value={editing.title}
              onChange={v =>
                setEditing({
                  ...editing,
                  title: v,
                })
              }
              placeholder="Web Development"
            />

            <Area
              label="Description"
              value={editing.desc}
              onChange={v =>
                setEditing({
                  ...editing,
                  desc: v,
                })
              }
              placeholder="Responsive websites and modern web applications."
              rows={6}
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
              SAVE SERVICE
            </SaveButton>
          </form>
        )}
      </div>
    </AdminShell>
  )
}
