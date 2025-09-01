"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextEditorMenuBar from "./TextEditorMenuBar";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import { useEffect } from "react";
import { sendArticle } from "@/services/db";

export default function TextEditor({ article }: any) {

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: "list-disc ml-3",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal ml-3",
          },
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight,
    ],
    content: `<>${article.summary}</>`,
    // Don't render immediately on the server to avoid SSR issues
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "min-h-[156px] w-full border focus:outline-none rounded-md bg-slate-50 py-2 px-3",
      },
    },
    onUpdate: ({ editor }) => {
      //   console.log(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && article) {
      // Previne a atualização se o conteúdo já for o mesmo
      if (editor.getHTML() === `${article.summary}`) {
        return;
      }
      editor.commands.setContent(`${article.summary}`);
    }
  }, [article, editor]);

  return (
    <div className="flex flex-col gap-5 ring ring-(--petrolBlue)/10 p-5">
      <input className="font-semibold px-4 py-1 rounded-md bg-(--petrolBlue)/20" />

      <TextEditorMenuBar editor={editor} />
      <EditorContent editor={editor} />
      <button
        onClick={() => sendArticle(article.id, editor?.getHTML() || "")}
        className="bg-(--petrolBlue) text-white px-2 py-1 rounded-md cursor-pointer"
      >
        Send
      </button>
    </div>
  );
}
