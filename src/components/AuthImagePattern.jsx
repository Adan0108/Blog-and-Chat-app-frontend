import CatIcon from "../assets/cute-cat.svg";
import CoffeeIcon from "../assets/coffee-icon.svg";

// Coffee-themed palette (fixed order)
const coffeeColors = [
  "bg-yellow-300", // 0
  "bg-amber-400",  // 1
  "bg-orange-300", // 2
  "bg-yellow-400", // 3
  "bg-amber-300",  // 4
  "bg-orange-400", // 5
  "bg-yellow-300", // 6
  "bg-amber-400",  // 7
  "bg-orange-300", // 8
];

const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:flex items-center justify-center bg-base-200 p-12">
      <div className="max-w-md text-center">
        <div className="grid grid-cols-3 gap-3 mb-8">
          {coffeeColors.map((bg, i) => {
            // Cats in 4 corners
            if ([0, 2, 6, 8].includes(i)) {
              return (
                <div
                  key={i}
                  className={`aspect-square rounded-2xl flex items-center justify-center ${bg}`}
                >
                  <img
                    src={CatIcon}
                    alt="cat"
                    className="w-3/4 h-3/4 object-contain hover:-translate-y-1 transition-transform duration-300"
                  />
                </div>
              );
            }

            // Coffee in the middle
            if (i === 4) {
              return (
                <div
                  key={i}
                  className={`aspect-square rounded-2xl flex items-center justify-center ${bg}`}
                >
                  <img
                    src={CoffeeIcon}
                    alt="coffee"
                    className="w-3/4 h-3/4 object-contain hover:-translate-y-1 transition-transform duration-300"
                  />
                </div>
              );
            }

            // Plain lighter coffee-colored squares (slower pulse)
            return (
              <div
                key={i}
                className={`aspect-square rounded-2xl ${bg} animate-pulse [animation-duration:3s]`}
              />
            );
          })}
        </div>
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-base-content/60">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;
