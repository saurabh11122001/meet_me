import React from 'react';

const Stories = () => {


  const friendsStories = [
    { id: 1, imageUrl: 'https://tse4.mm.bing.net/th?id=OIP.DVAdZAkYLSnO25A5YFWy4QHaHa&pid=Api&P=0&h=180' },
    { id: 2, imageUrl: 'https://tse2.mm.bing.net/th?id=OIP.AnNZgnNKiHMl_wpvYwoNfgHaH5&pid=Api&P=0&h=180' }
  ];

  return (
    <div className="flex bg-white  overflow-x-auto px-1 gap-3">
      <div className="relative border border-4 border-green-600 rounded-full ">
        <div className="w-14 h-14  rounded-full bg-blue-500 overflow-hidden">
          <img 
            src="https://tse2.mm.bing.net/th?id=OIP._dscY2Od2Np1uNGB8LRFkAHaGI&pid=Api&P=0&h=180"
            alt="Your Story"
            className="object-cover  w-full h-full"
          />
        </div>
        <span className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-1 text-xs text-white">
          Your
        </span>
      </div>
      {friendsStories.map((story) => (
        <div key={story.id} className="relative border border-4 border-pink-600  rounded-full ">
          <div className="w-14 h-14 rounded-full bg-gray-300 overflow-hidden">
            <img
              src={story.imageUrl}
              alt={story.name}
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Stories;
