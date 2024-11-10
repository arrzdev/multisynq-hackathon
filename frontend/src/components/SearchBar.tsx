
import { IoSearch } from "react-icons/io5";

const Searchbar = ({searchCategory, setSearchCategory, searchQuery, setSearchQuery}: {searchCategory: string, setSearchCategory: (category: string) => void, searchQuery: string, setSearchQuery: (query: string) => void}) => {
  return (
    <div className="sticky z-10 bg-transparent space-y-4 w-full p-2">
      {/* Search bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search..."
          className="container mx-auto h-14 bg-[#FDF0D5] shadow-[0px_-2px_4px_rgba(0,0,0,0.5),0px_2px_4px_rgba(0,0,0,0.5)] rounded-2xl cursor-pointer pl-4 pr-12 w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <IoSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#780000]" size={30} />
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2">
        {["All", "Music", "Sports", "Food", "Art"].map((name: string, index: number) => (
          <div 
            key={index} 
            className={`scroll-ml-6 snap-start container mx-auto h-8 shadow-[0px_-2px_4px_rgba(0,0,0,0.5),0px_2px_4px_rgba(0,0,0,0.5)] rounded-full cursor-pointer flex items-center text-center justify-center ${searchCategory === name ? 'bg-[#780000] text-zinc-100' : 'bg-[#FDF0D5]'}`}
            onClick={() => setSearchCategory(name)}
          >
            <p className="text-center">{name}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Searchbar
