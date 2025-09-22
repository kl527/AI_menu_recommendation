import Image from "next/image";

interface MenuCardProps {
  image: string;
  name: string;
  price: string;
  description?: string;
}

export default function MenuCard({ image, name, price, description }: MenuCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer">
      <div className="relative h-48 w-full">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{name}</h3>
        {description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>
        )}
        <div className="flex justify-between items-center">
          <span className="text-green-600 font-bold text-lg">${price}</span>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">
            Add to Order
          </button>
        </div>
      </div>
    </div>
  );
}
