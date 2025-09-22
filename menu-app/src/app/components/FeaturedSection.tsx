import Image from "next/image";

interface FeaturedItem {
  image: string;
  name: string;
  price: string;
  description: string;
}

interface FeaturedSectionProps {
  title: string;
  subtitle?: string;
  items: FeaturedItem[];
}

export default function FeaturedSection({ title, subtitle, items }: FeaturedSectionProps) {
  return (
    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 shadow-lg">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
        {subtitle && (
          <p className="text-gray-600 text-lg">{subtitle}</p>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="relative h-56 w-full">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">{item.name}</h3>
              <p className="text-gray-600 mb-4 text-sm leading-relaxed">{item.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-green-600 font-bold text-xl">${item.price}</span>
                <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-medium transition-colors shadow-md hover:shadow-lg">
                  Order Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
