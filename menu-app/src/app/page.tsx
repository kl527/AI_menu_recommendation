"use client";
import Image from "next/image";
import RecommendationCard from "./components/RecommendationCard";
import { useState, useEffect } from "react";

export default function Home() {
  // State to store current emotion from the Python server
  const [currentEmotion, setCurrentEmotion] = useState<string>("Calm");
  const [isConnected, setIsConnected] = useState<boolean>(false);

  // Function to fetch emotion data from Python server
  const fetchEmotion = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/emotion');
      if (response.ok) {
        const data = await response.json();
        setCurrentEmotion(data.emotion);
        setIsConnected(true);
        console.log('Current emotion:', data.emotion);
      } else {
        setIsConnected(false);
        console.log('Failed to fetch emotion data');
      }
    } catch (error) {
      setIsConnected(false);
      console.log('Error fetching emotion data:', error);
    }
  };

  // Fetch emotion data every 5 seconds
  useEffect(() => {
    // Initial fetch
    fetchEmotion();
    
    // Set up interval to fetch every 5 seconds
    const interval = setInterval(fetchEmotion, 5000);
    
    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // Emotion-based recommendations
  const getRecommendations = (emotion: string) => {
    const recommendations = {
      "Sadness": [
        {
          image: "/images/mocha.png",
          title: "White Chocolate Mocha",
          bullets: [
            <span key="b1"><span className="font-semibold">Sweetness</span> – activates the brain's dopamine reward pathways, giving an immediate sense of pleasure and comfort.</span>,
            <span key="b2"><span className="font-semibold">Creamy texture</span> – provides a soothing mouthfeel that promotes relaxation and a sense of warmth.</span>,
            <span key="b3"><span className="font-semibold">Warm temperature</span> – stimulates the parasympathetic nervous system, lowering stress hormones and helping the body relax.</span>,
            <span key="b4"><span className="font-semibold">Moderate caffeine</span> – offers a mild alertness lift without overwhelming stimulation, helping you feel gently energized as your mood improves.</span>
          ]
        },
        {
          image: "/images/baked_apple_croissant.png",
          title: "Baked Apple Croissant",
          bullets: [
            <span key="b1"><span className="font-semibold">Sweet cinnamon-apple filling</span> – delivers comforting flavors that can enhance serotonin activity and gently lift mood.</span>,
            <span key="b2"><span className="font-semibold">Spiced aromas (cinnamon, apple)</span> – promote relaxation and a sense of calm through their naturally soothing scent compounds.</span>,
            <span key="b3"><span className="font-semibold">Buttery layers</span> – provide a rich, creamy mouthfeel that feels indulgent and psychologically comforting.</span>,
            <span key="b4"><span className="font-semibold">Carbohydrates with a little fat</span> – help increase tryptophan availability, supporting serotonin production and easing sadness.</span>
          ]
        }
      ],
      "Anger": [
        {
          image: "/images/passion_tea.png",
          title: "Iced Passion Tango Herbal Tea",
          bullets: [
            <span key="b1"><span className="font-semibold">Caffeine-free herbal blend</span> – avoids stimulant effects, helping reduce physiological arousal and allowing the body to relax.</span>,
            <span key="b2"><span className="font-semibold">Cool temperature</span> – provides a mild cooling effect that can lower core body temperature and help calm anger.</span>,
            <span key="b3"><span className="font-semibold">Tart-fruity hibiscus and lemongrass</span> – deliver a refreshing sensory reset that can interrupt the cycle of tension.</span>,
            <span key="b4"><span className="font-semibold">Aromatic herbs</span> – subtle floral and citrus notes promote a sense of calm through soothing scent compounds.</span>
          ]
        },
        {
          image: "/images/cheese_protein_box.png",
          title: "Cheese Trio Protein Box",
          bullets: [
            <span key="b1"><span className="font-semibold">High-quality protein from cheese</span> – supports steady production of neurotransmitters like serotonin and dopamine, helping regulate mood.</span>,
            <span key="b2"><span className="font-semibold">Healthy fats from cheese and nuts</span> – slow glucose absorption, preventing blood-sugar spikes that can heighten irritability.</span>,
            <span key="b3"><span className="font-semibold">Balanced macronutrients</span> – promote satiety and stable energy, reducing the physical agitation that can accompany anger.</span>,
            <span key="b4"><span className="font-semibold">Chilled serving temperature</span> – offers a mild cooling effect that can help lower physiological arousal and calm intense emotions.</span>
          ]
        }
      ],
      "Stressed": [
        {
          image: "/images/sausage_egg_bites.png",
          title: "Italian Sausage Egg Bites",
          bullets: [
            <span key="b1"><span className="font-semibold">~15 g of high-quality protein</span> – helps stabilize blood sugar and maintain steady energy, preventing stress-related energy crashes.</span>,
            <span key="b2"><span className="font-semibold">Healthy fats from cheese and sausage</span> – provide slow-burning fuel that supports satiety and keeps cortisol spikes in check.</span>,
            <span key="b3"><span className="font-semibold">Warm temperature</span> – delivers gentle physical comfort and activates the parasympathetic nervous system, promoting relaxation.</span>,
            <span key="b4"><span className="font-semibold">Soft, custardy texture</span> – adds a soothing mouthfeel that helps you feel more grounded during stressful moments.</span>
          ]
        },
        {
          image: "/images/Iced Pecan Crunch Oatmilk Latte.png",
          title: "Iced Pecan Crunch Oatmilk Latte",
          bullets: [
            <span key="b1"><span className="font-semibold">Sweet, nutty flavors</span> – offer comfort and activate the brain's reward pathways, helping reduce stress.</span>,
            <span key="b2"><span className="font-semibold">Oat milk's beta-glucan fiber</span> – supports steady blood sugar, preventing energy dips that can heighten stress.</span>,
            <span key="b3"><span className="font-semibold">Moderate caffeine</span> – delivers a gentle boost in alertness without overstimulation, helping maintain focus under pressure.</span>,
            <span key="b4"><span className="font-semibold">Light crunch topping</span> – adds a pleasant sensory contrast, creating a small moment of mindful enjoyment that can interrupt stressful thoughts.</span>
          ]
        }
      ],
      "Calm": [
        {
          image: "/images/matcha.png",
          title: "Iced Matcha Green Tea Latte",
          bullets: [
            <span key="b1"><span className="font-semibold">L-theanine in matcha</span> – increases alpha brain-wave activity, promoting relaxed alertness and mental clarity.</span>,
            <span key="b2"><span className="font-semibold">Moderate natural caffeine (~80 mg in a grande)</span> – gives a gentle energy lift without overstimulation, helping maintain a balanced, tranquil state.</span>,
            <span key="b3"><span className="font-semibold">Smooth, lightly sweet flavor</span> – supports a serene yet focused mood, complementing a calm mindset.</span>,
            <span key="b4"><span className="font-semibold">Antioxidants (catechins)</span> – help reduce oxidative stress, supporting overall physical well-being while you stay relaxed.</span>
          ]
        },
        {
          image: "/images/foraccia.png",
          title: "Warm Tomato & Mozzarella on Focaccia",
          bullets: [
            <span key="b1"><span className="font-semibold">Complex carbohydrates</span> – release energy slowly, keeping blood sugar steady and supporting a stable, tranquil mood.</span>,
            <span key="b2"><span className="font-semibold">Moderate protein from mozzarella</span> – helps maintain sustained energy and supports neurotransmitter balance for continued calm.</span>,
            <span key="b3"><span className="font-semibold">Savory basil–tomato flavors</span> – provide balanced, satisfying taste without excess sugar, avoiding sudden spikes in energy or mood.</span>,
            <span key="b4"><span className="font-semibold">Soft focaccia texture</span> – adds a soothing mouthfeel that complements a peaceful, centered state.</span>
          ]
        }
      ],
      "Happy": [
        {
          image: "/images/raccoon_cake_pop.png",
          title: "Raccoon Cake Pop",
          bullets: [
            <span key="b1"><span className="font-semibold">Sweet flavor</span> – stimulates dopamine release in the brain's reward pathways, helping sustain feelings of joy.</span>,
            <span key="b2"><span className="font-semibold">Playful raccoon design</span> – adds visual novelty and fun, reinforcing positive emotions and enhancing enjoyment.</span>,
            <span key="b3"><span className="font-semibold">Small portion size</span> – provides a brief glucose boost for steady energy without an energy crash.</span>,
            <span key="b4"><span className="font-semibold">Creamy cake texture</span> – offers a soft, indulgent mouthfeel that complements a cheerful mood.</span>
          ]
        },
        {
          image: "/images/strawberry_lemonade.png",
          title: "Iced Strawberry Açaí Lemonade Refresher",
          bullets: [
            <span key="b1"><span className="font-semibold">Bright berry flavors</span> – reinforce positive affect through lively, uplifting taste.</span>,
            <span key="b2"><span className="font-semibold">Natural caffeine (~45 mg from green-coffee extract)</span> – provides a gentle alertness boost without the jitteriness of stronger coffee.</span>,
            <span key="b3"><span className="font-semibold">Cool, refreshing temperature</span> – offers a pleasant sensory lift that helps sustain upbeat energy.</span>,
            <span key="b4"><span className="font-semibold">Balanced sweetness</span> – delivers a quick glucose boost that supports continued positive energy without an energy crash.</span>
          ]
        }
      ],
      "Curious": [
        {
          image: "/images/pecan_cortado.png",
          title: "Pecan Oatmilk Cortado",
          subtitle: "(hot, sweet)",
          bullets: [
            <span key="b1"><span className="font-semibold">New pecan flavor</span> – offers a sense of novelty that satisfies curiosity and encourages exploration.</span>,
            <span key="b2"><span className="font-semibold">Bold espresso with creamy oat milk</span> – creates a striking contrast of strong and smooth, rewarding adventurous taste buds.</span>,
            <span key="b3"><span className="font-semibold">Natural oat-based beta-glucan fiber</span> – helps steady blood sugar, supporting clear, focused thinking while you explore.</span>,
            <span key="b4"><span className="font-semibold">Moderate caffeine</span> – provides a gentle mental lift that fuels inquisitiveness without overstimulation.</span>
          ]
        },
        {
          image: "/images/falafel_pockets.png",
          title: "Spicy Falafel Pockets",
          bullets: [
            <span key="b1"><span className="font-semibold">Capsaicin from chili</span> – gently raises alertness through TRPV1 activation, sharpening focus for exploration.</span>,
            <span key="b2"><span className="font-semibold">Plant protein and fiber from chickpeas</span> – help keep blood sugar steady, supporting sustained energy for inquisitive activities.</span>,
            <span key="b3"><span className="font-semibold">Crisp-soft texture contrast</span> – adds sensory variety that matches a curious mood.</span>,
            <span key="b4"><span className="font-semibold">Warm temperature</span> – offers comforting balance to the stimulating spices, keeping curiosity enjoyable without overwhelm.</span>
          ]
        }
      ]
    };

    return recommendations[emotion as keyof typeof recommendations] || recommendations["Calm"];
  };

  const menuItems = [
    { image: "/images/mocha.png", name: "White Chocolate Mocha" },
    { image: "/images/passion_tea.png", name: "Iced Passion Tango Herbal Tea" },
    { image: "/images/Iced Pecan Crunch Oatmilk Latte.png", name: "Iced Pecan Crunch Oatmilk Latte" },
    { image: "/images/matcha.png", name: "Iced Matcha Green Tea Latte" },
    { image: "/images/strawberry_lemonade.png", name: "Strawberry Açaí Lemonade Refresher" },
    { image: "/images/pecan_cortado.png", name: "Pecan Oatmilk Cortado" },
    { image: "/images/baked_apple_croissant.png", name: "Baked Apple Croissant" },
    { image: "/images/cheese_protein_box.png", name: "Cheese Trio Protein Box" },
    { image: "/images/sausage_egg_bites.png", name: "Italian Sausage Egg Bites" },
    { image: "/images/foraccia.png", name: "Warm Tomato & Mozzarella on Focaccia" },
    { image: "/images/raccoon_cake_pop.png", name: "Raccoon Cake Pop" },
    { image: "/images/falafel_pockets.png", name: "Spicy Falafel Pockets" }
  ];

  return (
    <div className="min-h-screen w-full">
      {/* Top: light green hero */}
      <section className="w-full" style={{ backgroundColor: "#EAF4EC" }}>
        <div className="max-w-7xl mx-auto px-8 md:px-16 pt-10 pb-20">
          {/* Headline */}
          <div className="mb-12 ml-30 text-left">
            <p className="text-3xl md:text-5xl font-semibold text-[#0b3a34]">You look {currentEmotion.toLowerCase()}.</p>
            <p className="text-2xl md:text-4xl font-semibold italic text-[#ff6b45] mt-2">Sunbucks AI recommends......</p>
            
            {/* Connection status indicator */}
          </div>

          {/* Dynamic recommendation blocks based on emotion */}
          <div className="grid grid-cols-1 ml-20">
            {getRecommendations(currentEmotion).map((rec, index) => (
              <div key={index} className="mb-8">
                <RecommendationCard
                  imageSrc={rec.image}
                  title={rec.title}
                  circleClassName="w-50 h-50"
                  bullets={rec.bullets}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Removed curved divider per request */}
      </section>

      {/* Bottom: dark green grid */}
      <section className="w-full" style={{ backgroundColor: "#1E3932" }}>
        <div className="max-w-7xl mx-auto px-8 md:px-16 py-14">
          <div className="grid grid-cols-2 grid-cols-6 gap-x-12 gap-y-16">
            {menuItems.map((item, idx) => (
              <div key={idx} className="flex items-center justify-center">
                <Image src={item.image} alt={item.name} width={220} height={220} className="object-contain" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
