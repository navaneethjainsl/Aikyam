import React from 'react';
import { Check, X } from 'lucide-react';

const avatarOptions = [
  { name: 'Default', image: 'https://i.pravatar.cc/300' },
  { name: 'Woman with Laptop', image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&q=80&w=300&h=300' },
  { name: 'Woman Working', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=300&h=300' },
  { name: 'Tabby Kitten', image: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?auto=format&fit=crop&q=80&w=300&h=300' },
  { name: 'Monkey', image: 'https://images.unsplash.com/photo-1501286353178-1ec881214838?auto=format&fit=crop&q=80&w=300&h=300' },
  { name: 'Default Avatar 1', image: 'https://i.pravatar.cc/300?img=1' },
  { name: 'Default Avatar 2', image: 'https://i.pravatar.cc/300?img=2' },
  { name: 'Default Avatar 3', image: 'https://i.pravatar.cc/300?img=3' },
];

const AvatarSelector = ({ isOpen, onClose, selectedAvatar, onSelectAvatar }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-aikyam-darkBlue border border-gray-700 sm:max-w-md w-full p-4 rounded relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white hover:text-gray-300"
        >
          <X className="h-6 w-6" />
        </button>
        <h2 className="text-xl text-white mb-4">Choose Your Avatar</h2>
        <div className="grid grid-cols-3 gap-4 mt-4">
          {avatarOptions.map((avatar, index) => (
            <div
              key={index}
              className={`relative cursor-pointer rounded-md overflow-hidden transition-all duration-200 ${
                selectedAvatar === avatar.image
                  ? 'ring-2 ring-purple-600'
                  : 'hover:opacity-80'
              }`}
              onClick={() => onSelectAvatar(avatar.image)}
            >
              <img
                src={avatar.image}
                alt={avatar.name}
                className="w-full h-24 object-cover"
              />
              {selectedAvatar === avatar.image && (
                <div className="absolute top-1 right-1 bg-purple-600 rounded-full p-0.5">
                  <Check className="h-4 w-4 text-white" />
                </div>
              )}
              <p className="text-xs text-center p-1 truncate text-white">
                {avatar.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AvatarSelector;
