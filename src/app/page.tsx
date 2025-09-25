import SearchBar from "@/components/SearchBar";

export default function Home() {
  return (
    <div
      className="h-screen bg-cover bg-center flex items-center justify-center relative"
      style={{ backgroundImage: "url('https://st3.depositphotos.com/9150328/14273/i/450/depositphotos_142739111-stock-photo-beautiful-dawn-with-orange-and.jpg')" }}
    >
      <div className="absolute inset-0 bg-black opacity-60" />
      <div className="relative z-10 flex flex-col items-center text-center text-white px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Explore the World
        </h1>
        <SearchBar mode="home" />
      </div>
    </div>
  );
}
