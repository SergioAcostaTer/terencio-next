import reviews from "@/data/reviews.json";

const googleReviewUrl = "https://g.page/r/CWkyvLywov7bEBM/review";
const googleInfo = {
  rating: "4.0",
  reviewCount: "463",
};
const googleIcon =
  "https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg";

function renderStars(rating: number) {
  return Array.from({ length: 5 }, (_, index) => index < rating);
}

export default function GoogleReviews() {
  return (
    <section className="border-t border-gray-100 bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={googleIcon} alt="Google Logo" className="h-8 w-8" />
            <div>
              <h2 className="text-xl leading-none font-bold text-gray-900">
                Reseñas de Google
              </h2>
              <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                <span className="font-bold text-gray-800">{googleInfo.rating}</span>
                <div className="flex text-xs text-yellow-400" aria-hidden="true">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <span key={index}>★</span>
                  ))}
                </div>
                <span>({googleInfo.reviewCount} reseñas)</span>
              </div>
            </div>
          </div>
          <a
            href={googleReviewUrl}
            target="_blank"
            rel="noreferrer"
            className="hidden text-sm font-medium text-blue-600 hover:underline sm:block"
          >
            Escribir una reseña
          </a>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {reviews.map((review) => (
            <div
              key={`${review.author}-${review.date}`}
              className="flex h-full flex-col rounded-xl border border-gray-100 bg-gray-50 p-4"
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full font-bold text-white ${review.color || "bg-gray-400"}`}
                  >
                    {review.avatar}
                  </div>
                  <div>
                    <div className="line-clamp-1 text-sm font-bold text-gray-900">
                      {review.author}
                    </div>
                    <div className="text-xs text-gray-500">{review.date}</div>
                  </div>
                </div>
                <img src={googleIcon} alt="G" className="h-4 w-4 opacity-50" />
              </div>

              <div className="mb-2 flex text-sm text-yellow-500" aria-hidden="true">
                {renderStars(review.rating).map((isFull, index) => (
                  <span key={index}>{isFull ? "★" : "☆"}</span>
                ))}
              </div>

              <p className="mb-4 flex-grow text-sm leading-relaxed text-gray-600">
                "{review.text}"
              </p>

              {review.photos ? (
                <div className="mb-3">
                  <span className="flex w-fit items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs font-bold text-blue-700">
                    <span aria-hidden="true">📷</span> Con fotos
                  </span>
                </div>
              ) : null}

              {review.response ? (
                <div className="mt-auto rounded-lg border border-gray-200 bg-white p-3 text-xs">
                  <p className="mb-1 font-bold text-gray-800">
                    Respuesta del propietario:
                  </p>
                  <p className="italic text-gray-500">{review.response}</p>
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <a
            href={googleReviewUrl}
            target="_blank"
            rel="noreferrer"
            className="font-bold text-blue-600 hover:underline"
          >
            Ver todas las reseñas
          </a>
        </div>
      </div>
    </section>
  );
}
