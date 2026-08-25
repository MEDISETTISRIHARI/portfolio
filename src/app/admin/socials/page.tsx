'use client'

import { FormEvent, useState } from 'react'
import {
  AdminShell,
  Check,
  Field,
  Notice,
  SaveButton,
  emptySocial,
  useAdminData,
  SocialData,
} from '@/components/admin/AdminUI'

export default function SocialsAdmin() {
  const editor = useAdminData<SocialData[]>(
    'socials',
    []
  )

  const [editing, setEditing] =
    useState<SocialData | null>(null)

  async function submit(e: FormEvent) {
    e.preventDefault()

    if (!editing) return

    const ok = await editor.save(editing)

    if (ok) {
      setEditing(null)
    }
  }

  async function remove(item: SocialData) {
    if (!item.id) return

    if (
      !window.confirm(
        `Delete "${item.platform}"?`
      )
    ) {
      return
    }

    await editor.remove(item.id)
  }

  return (
    <AdminShell
      title="Social links"
      description="Manage your social profiles and links."
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
                  ...emptySocial,
                  order: editor.data.length,
                })
              }
              className="w-full border border-white/20 bg-white px-5 py-4 text-sm font-medium text-black"
            >
              + ADD SOCIAL LINK
            </button>

            {editor.data.length === 0 && (
              <div className="border border-white/10 p-8 text-center text-white/40">
                No social links yet.
              </div>
            )}

            {editor.data.map(item => (
              <div
                key={item.id}
                className="border border-white/10 p-6"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:justify-between">
                  <div>
                    <p className="text-xs tracking-[0.2em] text-white/40">
                      {item.platform}
                    </p>

                    <h2 className="mt-2 text-xl">
                      {item.username}
                    </h2>

                    <p className="mt-2 break-all text-sm text-white/50">
                      {item.url}
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
              label="Platform"
              value={editing.platform}
              onChange={v =>
                setEditing({
                  ...editing,
                  platform: v,
                })
              }
              placeholder="LinkedIn"
            />

            <Field
              label="Username"
              value={editing.username}
              onChange={v =>
                setEditing({
                  ...editing,
                  username: v,
                })
              }
              placeholder="@yourusername"
            />

            <Field
              label="URL"
              value={editing.url}
              onChange={v =>
                setEditing({
                  ...editing,
                  url: v,
                })
              }
              placeholder="https://linkedin.com/in/..."
            />

            <Field
              label="Icon"
              value={editing.icon}
              onChange={v =>
                setEditing({
                  ...editing,
                  icon: v,
                })
              }
              placeholder="linkedin"
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
              SAVE SOCIAL LINK
            </SaveButton>
          </form>
        )}
      </div>
    </AdminShell>
  )
}
