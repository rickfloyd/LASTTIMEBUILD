
import React from 'react';

const PlaceholderCard: React.FC<{ index: number }> = ({ index }) => {
    const borderColor = index % 2 === 0 ? 'border-outline-orange' : 'border-outline-magenta';
    const shadowColor = index % 2 === 0 ? 'shadow-outline-orange' : 'shadow-outline-magenta';

    return (
        <div className={`w-[192px] h-[96px] bg-black bg-opacity-20 backdrop-blur-lg rounded-lg p-4 m-2 flex justify-center items-center border ${borderColor} ${shadowColor}`}>
            <p className="text-white">2x1 Card</p>
        </div>
    );
};

const PlaceholderCards: React.FC = () => {
    const cards = Array(25).fill(0).map((_, i) => <PlaceholderCard key={i} index={i} />);
    return (
        <div className="flex flex-wrap justify-center p-5">
            {cards}
        </div>
    );
};

export default PlaceholderCards;
