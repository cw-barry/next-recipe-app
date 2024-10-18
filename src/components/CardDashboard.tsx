import React from 'react';

interface IProps {
  image: string;
  title: string;
  slug: string;
}

export default function CardDashboard({ image, title, slug }: IProps) {
  return (
    <div className="flex flex-col w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <div>
        <a href={`/recipe/${slug}`}>
          <img className="p-8 rounded-t-lg" src={image} alt="recipe-image" />
        </a>
      </div>
      {/* Make this div a flex container */}
      <div className="px-5 pb-5 flex flex-col flex-1">
        <div className="text-center flex-1">
          <a href="#">
            <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
              {title}
            </h5>
          </a>
        </div>

        <div className="flex items-center justify-between mt-5">
          <span className="text-3xl font-bold text-gray-900 dark:text-white"></span>
          <a
            href={`/recipe/${slug}`}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Details
          </a>
        </div>
      </div>
    </div>
  );
}
