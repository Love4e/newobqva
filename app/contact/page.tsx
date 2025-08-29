export default function ContactPage() {
  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Контакти</h1>
      <p className="mb-4">
        Ако имате въпроси или предложения, можете да се свържете с нас:
      </p>
      <ul className="space-y-2">
        <li><b>Имейл:</b> support@novaobyava.bg</li>
        <li><b>Телефон:</b> +359 890 219 040</li>
      </ul>

      <form className="mt-6 max-w-lg space-y-4">
        <input
          type="text"
          placeholder="Петър Петров"
          className="w-full border rounded px-3 py-2"
          required
        />
        <input
          type="email"
          placeholder="petar_petrov@abv.bg"
          className="w-full border rounded px-3 py-2"
          required
        />
        <textarea
          placeholder="Вашето съобщение"
          className="w-full border rounded px-3 py-2"
          rows={5}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Изпрати
        </button>
      </form>
    </main>
  );
}
