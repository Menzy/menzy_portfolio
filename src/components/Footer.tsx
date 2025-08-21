export function Footer() {
  return (
    <footer className="relative h-[70vh] border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-black overflow-hidden">
      {/* Background Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <h1 className="text-[8rem] md:text-[10rem] lg:text-[12rem] font-bold text-black select-none">
          wanmenzy
        </h1>
      </div>

      {/* Bento Grid */}
      <div className="relative z-10 h-full p-2">
        {/* 3x3 grid with first row twice the height of second and third rows */}
        <div className="w-full h-full p-2 grid grid-cols-3 gap-4" style={{ gridTemplateRows: '2fr 1fr 1fr' }}>
          {/* Top Row */}
          {/* Work - top-left spanning 2 columns */}
          <div className="col-start-1 col-span-2 row-start-1 bg-neutral-200/50 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl p-6 flex items-end justify-start hover:bg-neutral-200/65 hover:backdrop-blur-lg transition-all duration-300 cursor-pointer">
            <span className="text-lg font-medium text-foreground">Work</span>
          </div>

          {/* Lab - top-right single cell */}
          <div className="col-start-3 row-start-1 bg-neutral-200/50 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl p-6 flex items-end justify-start hover:bg-neutral-200/65 hover:backdrop-blur-lg transition-all duration-300 cursor-pointer">
            <span className="text-lg font-medium text-foreground">Lab</span>
          </div>

          {/* Middle/Bottom Rows */}
          {/* YouTube - middle-left */}
          <a
            href="https://youtube.com/@menzy"
            target="_blank"
            rel="noopener noreferrer"
            className="col-start-1 row-start-2 bg-neutral-200/50 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl p-6 flex items-end justify-start hover:bg-neutral-200/65 hover:backdrop-blur-lg transition-all duration-300"
          >
            <span className="text-lg font-medium text-foreground">YouTube</span>
          </a>

          {/* Github - bottom-left */}
          <a
            href="https://github.com/menzy"
            target="_blank"
            rel="noopener noreferrer"
            className="col-start-1 row-start-3 bg-neutral-200/50 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl p-6 flex items-end justify-start hover:bg-neutral-200/65 hover:backdrop-blur-lg transition-all duration-300"
          >
            <span className="text-lg font-medium text-foreground">Github</span>
          </a>

          {/* Instagram - center column spanning two rows (middle and bottom) */}
          <a
            href="https://instagram.com/1menzy"
            target="_blank"
            rel="noopener noreferrer"
            className="col-start-2 row-start-2 row-span-2 bg-neutral-200/50 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl p-6 flex items-end justify-start hover:bg-neutral-200/65 hover:backdrop-blur-lg transition-all duration-300"
          >
            <span className="text-lg font-medium text-foreground">Instagram</span>
          </a>

          {/* LinkedIn - middle-right */}
          <a
            href="https://linkedin.com/in/wanmenzy"
            target="_blank"
            rel="noopener noreferrer"
            className="col-start-3 row-start-2 row-span-2 bg-neutral-200/50 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl p-6 flex items-end justify-start hover:bg-neutral-200/65 hover:backdrop-blur-lg transition-all duration-300"
          >
            <span className="text-lg font-medium text-foreground">LinkedIn</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
