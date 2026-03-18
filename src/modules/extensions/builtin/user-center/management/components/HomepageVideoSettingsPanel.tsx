"use client";

import { useEffect, useState } from "react";
import { Film, Plus, Trash2 } from "lucide-react";

import Card from "../../components/Card";
import type {
  HomepageVideoEntry,
  HomepageVideoSettingsResponse,
} from "@/lib/home/homepageVideo";

type HomepageVideoSettingsPanelProps = {
  settings?: HomepageVideoSettingsResponse;
  isLoading?: boolean;
  isSaving?: boolean;
  canEdit: boolean;
  statusMessage?: string;
  errorMessage?: string;
  onSave: (payload: HomepageVideoSettingsResponse) => Promise<void>;
};

function normalizeEntry(entry?: HomepageVideoEntry): HomepageVideoEntry {
  return {
    domain: entry?.domain?.trim() ?? "",
    videoUrl: entry?.videoUrl?.trim() ?? "",
    posterUrl: entry?.posterUrl?.trim() ?? "",
  };
}

export default function HomepageVideoSettingsPanel({
  settings,
  isLoading = false,
  isSaving = false,
  canEdit,
  statusMessage,
  errorMessage,
  onSave,
}: HomepageVideoSettingsPanelProps) {
  const [defaultEntry, setDefaultEntry] = useState<HomepageVideoEntry>({
    videoUrl: "",
    posterUrl: "",
  });
  const [overrides, setOverrides] = useState<HomepageVideoEntry[]>([]);

  useEffect(() => {
    if (!settings) {
      return;
    }
    setDefaultEntry(normalizeEntry(settings.defaultEntry));
    setOverrides(settings.overrides.map((item) => normalizeEntry(item)));
  }, [settings]);

  return (
    <Card>
      <div className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
              <Film className="h-3.5 w-3.5" />
              产品演示视频
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                按域名配置首页演示链接
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                默认走主站视频；如某个域名需要独立内容，可在下方增加覆盖项。
              </p>
            </div>
          </div>
          <button
            type="button"
            disabled={!canEdit || isSaving}
            onClick={() => {
              void onSave({
                defaultEntry: normalizeEntry(defaultEntry),
                overrides: overrides.map((item) => normalizeEntry(item)),
              });
            }}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? "保存中..." : canEdit ? "保存视频配置" : "仅可查看"}
          </button>
        </div>

        {statusMessage ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {statusMessage}
          </div>
        ) : null}
        {errorMessage ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {errorMessage}
          </div>
        ) : null}

        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">默认视频</h3>
            <span className="text-xs text-slate-500">所有未覆盖域名共用</span>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <label className="space-y-1.5">
              <span className="text-xs font-medium text-slate-600">
                视频链接
              </span>
              <input
                value={defaultEntry.videoUrl ?? ""}
                onChange={(event) =>
                  setDefaultEntry((current) => ({
                    ...current,
                    videoUrl: event.target.value,
                  }))
                }
                disabled={!canEdit || isLoading}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400 disabled:bg-slate-100"
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-xs font-medium text-slate-600">
                Poster 链接
              </span>
              <input
                value={defaultEntry.posterUrl ?? ""}
                onChange={(event) =>
                  setDefaultEntry((current) => ({
                    ...current,
                    posterUrl: event.target.value,
                  }))
                }
                disabled={!canEdit || isLoading}
                placeholder="https://cdn.example.com/poster.jpg"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400 disabled:bg-slate-100"
              />
            </label>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">域名覆盖</h3>
              <p className="mt-1 text-xs text-slate-500">
                例如 `cn-www.svc.plus` 使用 Bilibili，其余域名继续使用默认配置。
              </p>
            </div>
            <button
              type="button"
              disabled={!canEdit || isSaving}
              onClick={() =>
                setOverrides((current) => [
                  ...current,
                  { domain: "", videoUrl: "", posterUrl: "" },
                ])
              }
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Plus className="h-4 w-4" />
              添加域名覆盖
            </button>
          </div>

          {overrides.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-6 text-sm text-slate-500">
              当前没有额外域名覆盖，所有站点都会使用默认视频。
            </div>
          ) : null}

          {overrides.map((item, index) => (
            <div
              key={`${item.domain}-${index}`}
              className="rounded-2xl border border-slate-200 bg-white p-4"
            >
              <div className="grid gap-3 lg:grid-cols-[0.9fr_1.2fr_1.2fr_auto]">
                <label className="space-y-1.5">
                  <span className="text-xs font-medium text-slate-600">
                    域名
                  </span>
                  <input
                    value={item.domain ?? ""}
                    onChange={(event) =>
                      setOverrides((current) =>
                        current.map((entry, entryIndex) =>
                          entryIndex === index
                            ? { ...entry, domain: event.target.value }
                            : entry,
                        ),
                      )
                    }
                    disabled={!canEdit || isLoading}
                    placeholder="cn-www.svc.plus"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400 disabled:bg-slate-100"
                  />
                </label>
                <label className="space-y-1.5">
                  <span className="text-xs font-medium text-slate-600">
                    视频链接
                  </span>
                  <input
                    value={item.videoUrl}
                    onChange={(event) =>
                      setOverrides((current) =>
                        current.map((entry, entryIndex) =>
                          entryIndex === index
                            ? { ...entry, videoUrl: event.target.value }
                            : entry,
                        ),
                      )
                    }
                    disabled={!canEdit || isLoading}
                    placeholder="https://www.bilibili.com/video/BV..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400 disabled:bg-slate-100"
                  />
                </label>
                <label className="space-y-1.5">
                  <span className="text-xs font-medium text-slate-600">
                    Poster 链接
                  </span>
                  <input
                    value={item.posterUrl ?? ""}
                    onChange={(event) =>
                      setOverrides((current) =>
                        current.map((entry, entryIndex) =>
                          entryIndex === index
                            ? { ...entry, posterUrl: event.target.value }
                            : entry,
                        ),
                      )
                    }
                    disabled={!canEdit || isLoading}
                    placeholder="可选"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400 disabled:bg-slate-100"
                  />
                </label>
                <div className="flex items-end">
                  <button
                    type="button"
                    disabled={!canEdit || isSaving}
                    onClick={() =>
                      setOverrides((current) =>
                        current.filter((_, entryIndex) => entryIndex !== index),
                      )
                    }
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-rose-600 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                    aria-label="Remove override"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
