"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const touchStartX = useRef<number | null>(null);
  const [collectionIndex, setCollectionIndex] = useState(0);

  const products: Record<string, { name: string; price: number; image: string }[]> = {
    "Tote Bags": [
      { name: "Patchwork Tote A", price: 1299, image: "/images/products/tote-bags/sample-1.jpg" },
      { name: "Patchwork Tote B", price: 1399, image: "/images/products/tote-bags/sample-2.jpg" },
      { name: "Patchwork Tote C", price: 1499, image: "/images/products/tote-bags/sample-3.jpg" },
    ],
    Pouches: [
      { name: "Mini Pouch A", price: 399, image: "/images/products/pouches/sample-1.jpg" },
      { name: "Mini Pouch B", price: 449, image: "/images/products/pouches/sample-2.jpg" },
      { name: "Mini Pouch C", price: 499, image: "/images/products/pouches/sample-3.jpg" },
    ],
    "Coin Purses": [
      { name: "Coin Purse A", price: 299, image: "/images/products/coin-purses/sample-1.jpg" },
      { name: "Coin Purse B", price: 329, image: "/images/products/coin-purses/sample-2.jpg" },
      { name: "Coin Purse C", price: 349, image: "/images/products/coin-purses/sample-3.jpg" },
    ],
  };

  // function to open the modal when needed in future
  const openModal = (category: string) => {
    setSelectedCategory(category);
    setActiveIndex(0);
    setQuantity(1);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const goPrev = () => {
    if (!selectedCategory) return;
    const items = products[selectedCategory] ?? [];
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const goNext = () => {
    if (!selectedCategory) return;
    const items = products[selectedCategory] ?? [];
    setActiveIndex((prev) => (prev + 1) % items.length);
  };

  const onTouchStart: React.TouchEventHandler<HTMLDivElement> = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd: React.TouchEventHandler<HTMLDivElement> = (e) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(deltaX) > 40) {
      if (deltaX > 0) {
        goPrev();
      } else {
        goNext();
      }
    }
    touchStartX.current = null;
  };

  // Inline the key handlers to avoid depending on goPrev/goNext in deps
  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      if (!isModalOpen) return;
      if (ev.key === "Escape") closeModal();
      if (!selectedCategory) return;
      const items = products[selectedCategory] ?? [];
      if (ev.key === "ArrowLeft") {
        setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
      }
      if (ev.key === "ArrowRight") {
        setActiveIndex((prev) => (prev + 1) % items.length);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isModalOpen, selectedCategory]);
  type Bubble = { size: number; left: number; top: number; duration: number; delay: number; hueIndex: number };
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    // Generate bubbles on client to avoid SSR hydration mismatches
    const count = 16;
    const next: Bubble[] = Array.from({ length: count }).map(() => ({
      size: 80 + Math.round(Math.random() * 180),
      left: Math.round(Math.random() * 100),
      top: Math.round(Math.random() * 100),
      duration: 14 + Math.round(Math.random() * 10),
      delay: Math.round(Math.random() * 8),
      hueIndex: Math.floor(Math.random() * 3),
    }));
    setBubbles(next);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-purple-50 relative overflow-hidden">
      {/* Floating bubble background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {bubbles.map((b, i) => {
          const hues = ["from-purple-300 to-pink-200", "from-teal-200 to-purple-200", "from-purple-200 to-indigo-200"]; 
          const hue = hues[b.hueIndex % hues.length];
          const styleVars = { "--dur": `${b.duration}s` } as React.CSSProperties & Record<'--dur', string>;
          return (
            <div
              key={i}
              className={`bubble-float absolute rounded-full bg-gradient-to-br ${hue} opacity-30 blur-2xl`}
              style={{ width: b.size, height: b.size, left: `${b.left}%`, top: `${b.top}%`, animationDelay: `${b.delay}s`, ...styleVars }}
            />
          );
        })}
      </div>
      {/* Header */}
      <header className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <Image
              src="/images/logos/likha-logo.jpg"
              alt="Likha Logo"
              width={40}
              height={40}
              className="w-10 h-10"
            />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-purple-800">Likha&apos;s</h1>
              <p className="text-sm text-gray-600">Handcrafted Bags</p>
            </div>
          </div>

          {/* Navigation - Hidden on mobile, shown on larger screens */}
          <nav className="hidden md:flex flex-1 justify-center items-center space-x-8">
            <a href="#" className="text-purple-800 hover:text-purple-600 transition-colors">Home</a>
            <a href="#shop" className="text-purple-800 hover:text-purple-600 transition-colors">Shop</a>
            <a href="#about" className="text-purple-800 hover:text-purple-600 transition-colors">About</a>
          </nav>

          {/* Shopping Cart */}
          <div className="flex items-center">
            {/* <Image
              src="/images/logos/shopping-cart.svg"
              alt="Cart"
              width={24}
              height={24}
              className="w-6 h-6"
            /> */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto text-center">
          {/* Large Logo */}
          <div className="mb-8 sm:mb-12">
            <Image
              src="/images/logos/likha-logo.jpg"
              alt="Likha Large Logo"
              width={200}
              height={200}
              className="mx-auto w-32 h-32 sm:w-48 sm:h-48 lg:w-56 lg:h-56"

            />
          </div>

          {/* Brand Name with Gradient */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-teal-500 to-purple-600 bg-clip-text text-transparent">
              Likha&apos;s
            </span>
          </h2>

          {/* Tagline */}
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-800 mb-8">
            Handcrafted Bags
          </h3>

          {/* Description */}
          <p className="text-lg sm:text-xl text-gray-700 mb-12 max-w-2xl mx-auto leading-relaxed">
            Discover our collection of beautifully handcrafted tote bags, pouches, and coin purses. 
            Each piece is made with love and can be customized to match your unique style.
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
            <a href="#shop" className="bg-gradient-to-r from-purple-600 to-teal-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-purple-700 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2">
              <Image
                src="/images/logos/shopping-cart.svg"
                alt="Shop"
                width={20}
                height={20}
                className="w-5 h-5 filter brightness-0 invert"
              />
              <span>Shop Now</span>
            </a>
            
            <a href="#collections" className="border-2 border-purple-600 text-purple-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-purple-600 hover:text-white transition-all duration-300 transform hover:scale-105">
              View Collection
            </a>
          </div>
        </div>
      </main>

      {/* Scan to Order */}
      <section id="shop" className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-purple-800 mb-4">Scan to Order</h2>
          <p className="text-lg sm:text-xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">Scan the QR code below to place your order directly.</p>
          <div className="bg-white rounded-2xl shadow-md p-6 inline-block">
            <Image
              src="/images/qr-order.jpg"
              alt="Scan this QR to order"
              width={320}
              height={320}
              className="w-64 sm:w-72 md:w-80 h-auto mx-auto"
            />
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 mb-3">If the QR code doesn&apos;t work, click this:</p>
              <a
                href="https://form.jotform.com/252493995340466"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-gradient-to-r from-purple-600 to-teal-500 text-white px-5 py-3 rounded-full font-semibold hover:from-purple-700 hover:to-teal-600 transition-colors"
              >
                Open Order Form
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Collections Carousel */}
      <section id="collections" className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-purple-800">Collections</h2>
            <p className="text-gray-700 mt-2">A glimpse of our recent handcrafted pieces.</p>
          </div>

          {(() => {
            const images = [
              "/images/products/caro1.jpg",
              "/images/products/caro2.jpg",
              "/images/products/caro3.jpg",
              "/images/products/caro4.jpg",
              "/images/products/caro5.jpg",
              "/images/products/caro6.jpg",
              "/images/products/caro7.jpg",
              "/images/products/caro8.jpg",
            ];
            const current = ((collectionIndex % images.length) + images.length) % images.length;
            const prev = () => setCollectionIndex((i) => (i - 1 + images.length) % images.length);
            const next = () => setCollectionIndex((i) => (i + 1) % images.length);
            const onTouchStartCol: React.TouchEventHandler<HTMLDivElement> = (e) => { touchStartX.current = e.touches[0].clientX; };
            const onTouchEndCol: React.TouchEventHandler<HTMLDivElement> = (e) => {
              if (touchStartX.current === null) return;
              const dx = e.changedTouches[0].clientX - touchStartX.current;
              if (Math.abs(dx) > 40) {
                if (dx > 0) {
                  prev();
                } else {
                  next();
                }
              }
              touchStartX.current = null;
            };

            return (
              <div className="relative">
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-white shadow" onTouchStart={onTouchStartCol} onTouchEnd={onTouchEndCol}>
                  <div
                    className="flex h-full transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${current * 100}%)` }}
                  >
                    {images.map((src, idx) => (
                      <div key={idx} className="w-full shrink-0 relative">
                        <Image src={src} alt={`Collection ${idx + 1}`} fill className="object-contain" />
                      </div>
                    ))}
                  </div>
                </div>

                <button onClick={prev} aria-label="Previous" className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-purple-700 border border-purple-200 rounded-full w-9 h-9 grid place-items-center shadow">
                  ‹
                </button>
                <button onClick={next} aria-label="Next" className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-purple-700 border border-purple-200 rounded-full w-9 h-9 grid place-items-center shadow">
                  ›
                </button>

                <div className="mt-4 flex items-center justify-center gap-2">
                  {images.map((_, i) => (
                    <button key={i} onClick={() => setCollectionIndex(i)} aria-label={`Go to slide ${i + 1}`} className={`h-2.5 w-2.5 rounded-full ${i === current ? 'bg-purple-600' : 'bg-purple-300'} transition-colors`} />
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-purple-800 mb-4">About</h2>
          <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
            Likha is a creative sewing brand that handcrafts pouches and tote bags from recycled cloth patches, stitched together with love and purpose. Each piece carries its own unique charm while promoting sustainability—proof that fashion can be both functional and kind to the planet.
          </p>
        </div>
      </section>

      {/* Mobile Navigation Menu */}
      <div className="md:hidden sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-2">
        <nav className="flex justify-around items-center">
          <a href="#" className="flex flex-col items-center space-y-1 text-purple-800">
            <span className="text-xs">Home</span>
          </a>
          <a href="#shop" className="flex flex-col items-center space-y-1 text-purple-800">
            <span className="text-xs">Shop</span>
          </a>
          <a href="#about" className="flex flex-col items-center space-y-1 text-purple-800">
            <span className="text-xs">About</span>
          </a>
        </nav>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-start justify-between gap-10">
            {/* Brand */}
            <div className="max-w-sm">
              <div className="flex items-center space-x-3 mb-4">
                <Image
                  src="/images/logos/likha-logo.jpg"
                  alt="Likha Logo"
                  width={36}
                  height={36}
                  className="w-9 h-9 rounded"
                />
                <div>
                  <p className="text-lg font-semibold text-purple-800">Likha&apos;s</p>
                  <p className="text-sm text-gray-600">Handcrafted Bags</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Thoughtfully crafted totes, pouches, and purses made from recycled cloth patches.
                Style with purpose.
              </p>
            </div>

            {/* Links */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 w-full md:w-auto">
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Company</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="text-gray-600 hover:text-purple-700 transition-colors">Home</a></li>
                  <li><a href="#shop" className="text-gray-600 hover:text-purple-700 transition-colors">Shop</a></li>
                  <li><a href="#about" className="text-gray-600 hover:text-purple-700 transition-colors">About</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Resources</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="text-gray-600 hover:text-purple-700 transition-colors">Care Guide</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-purple-700 transition-colors">Sizing & Fit</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-purple-700 transition-colors">Shipping & Returns</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Contact</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="mailto:hello@likha.shop" className="text-gray-600 hover:text-purple-700 transition-colors">hello@likha.shop</a></li>
                  <li><span className="text-gray-600">Mon–Fri, 9am–5pm</span></li>
                  <li><span className="text-gray-600">Philippines</span></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <p>© {new Date().getFullYear()} Likha. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-purple-700 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-purple-700 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Product Modal */}
      {isModalOpen && selectedCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-transparent" onClick={closeModal}></div>
          <div className="relative bg-white w-full max-w-2xl mx-4 rounded-2xl shadow-2xl overflow-hidden">
            <button onClick={closeModal} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">✕</button>
            <div className="p-5 border-b">
              <h3 className="text-xl font-semibold text-purple-800">{selectedCategory}</h3>
            </div>

            <div className="p-5" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
              {(() => {
                const items = products[selectedCategory] ?? [];
                const item = items[activeIndex];
                if (!item) return <p className="text-center text-gray-600">No items yet. Add images to the folder.</p>;
                return (
                  <div>
                    <div className="relative w-full aspect-[4/3] mb-4 rounded-xl overflow-hidden bg-gray-50">
                      <Image src={item.image} alt={item.name} fill className="object-contain" />
                    </div>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-lg font-semibold text-gray-900">{item.name}</p>
                        <p className="text-purple-700 font-bold">₱{item.price.toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={goPrev} className="px-3 py-2 rounded-md border text-sm hover:bg-gray-50">Prev</button>
                        <span className="text-sm text-gray-500">{activeIndex + 1} / {items.length}</span>
                        <button onClick={goNext} className="px-3 py-2 rounded-md border text-sm hover:bg-gray-50">Next</button>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mb-5">
                      <label htmlFor="qty" className="text-sm text-gray-700">Quantity</label>
                      <input id="qty" type="number" min={1} value={quantity} onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))} className="w-20 border rounded-md px-3 py-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button className="bg-gradient-to-r from-purple-600 to-teal-500 text-white px-5 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-teal-600 transition-colors">Buy Now</button>
                      <button className="border-2 border-purple-600 text-purple-600 px-5 py-3 rounded-lg font-semibold hover:bg-purple-600 hover:text-white transition-colors">Add to Cart</button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
