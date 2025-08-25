type Props = {
  mine: boolean;
  text: string;
  time?: string;
  name?: string;
};

export default function MessageBubble({ mine, text, time, name }: Props) {
  const base =
    "max-w-[80%] rounded-2xl px-3 py-2 shadow-sm whitespace-pre-wrap break-words";
  const mineCls = "bg-gradient-to-br from-pink-500 to-rose-400 text-white";
  const otherCls = "bg-white text-slate-900 border border-slate-200";

  return (
    <div className={`flex w-full mb-2 ${mine ? "justify-end" : "justify-start"}`}>
      <div className={`${base} ${mine ? mineCls : otherCls}`}>
        {!mine && name && (
          <div className="text-[11px] text-slate-500 mb-0.5">{name}</div>
        )}
        <div>{text}</div>
        {time && (
          <div className={`text-[10px] mt-1 ${mine ? "text-white/70" : "text-slate-400"}`}>
            {time}
          </div>
        )}
      </div>
    </div>
  );
}
