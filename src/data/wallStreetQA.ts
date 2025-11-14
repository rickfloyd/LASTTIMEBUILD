// src/data/wallStreetQA.ts

export interface QA {
  question: string;
  answer: string;
  keywords: string[];
}

export const wallStreetData: QA[] = [
    // PART 1 – Origins & History
    {
        question: "What is the biggest myth about how Wall Street got its name?",
        answer: "The most common myth is that Wall Street is named after a wall built by the Dutch to protect against Native Americans. The reality is more complex; the wall was primarily built in the 1650s to defend the New Amsterdam settlement from potential attacks by the British and pirates. While conflicts with native tribes occurred, the wall's main purpose was military defense against other colonial powers. The street running alongside it naturally became known as Wall Street.",
        keywords: ["wall street name", "myth", "origin", "dutch wall", "new amsterdam"],
    },
    {
        question: "What was the Buttonwood Agreement?",
        answer: "The Buttonwood Agreement was a foundational pact signed on May 17, 1792, by 24 stockbrokers and merchants under a buttonwood tree on Wall Street. It established two key principles: 1) they would only trade with each other, creating an exclusive club, and 2) they would charge a minimum commission of 0.25% on all sales. This agreement is considered the origin of the New York Stock Exchange (NYSE).",
        keywords: ["buttonwood agreement", "nyse founding", "1792", "stockbrokers"],
    },
    {
        question: "How did the Buttonwood Agreement lead to the NYSE?",
        answer: "The agreement brought order and trust to a chaotic, informal market. By creating an exclusive group with standardized fees, it established a centralized marketplace. This group first rented a room for trading and, in 1817, formally organized as the New York Stock & Exchange Board. It was renamed the New York Stock Exchange (NYSE) in 1863, evolving directly from the structure created by the Buttonwood signers.",
        keywords: ["buttonwood agreement", "nyse", "new york stock exchange", "founding"],
    },
    {
        question: "What really caused the stock market crash of 1929?",
        answer: "The crash of 1929 was not a single event but a collapse caused by a perfect storm. The primary factors were: 1) extreme speculation and overvaluation during the 'Roaring Twenties,' 2) excessive use of leverage, where investors borrowed up to 90% of a stock's price, 3) a weak and unregulated banking system, and 4) a series of margin calls that triggered a domino effect of forced selling. A slowing economy and agricultural recession had already weakened confidence before the panic began.",
        keywords: ["crash of 1929", "great depression", "cause", "leverage", "margin calls", "speculation"],
    },
    {
        question: "What was the 'Flash Crash' of 2010?",
        answer: "The Flash Crash on May 6, 2010, was a trillion-dollar stock market crash that lasted only 36 minutes. It was primarily caused by a single, large automated sell order for E-mini S&P 500 futures placed by a mutual fund. This massive order triggered a cascade of high-frequency trading (HFT) algorithms to pull liquidity and sell aggressively, creating a rapid, self-reinforcing downward spiral that was just as quickly reversed.",
        keywords: ["flash crash", "2010", "hft", "high-frequency trading", "algorithms"],
    },
    {
        question: "What was Black Monday (1987)?",
        answer: "Black Monday, on October 19, 1987, was the largest single-day percentage drop in the Dow Jones Industrial Average's history (22.6%). The crash was largely blamed on the new technology of 'program trading,' where computers were programmed to automatically sell large blocks of stock when certain price thresholds were hit. This created a cascade of selling that overwhelmed the market, which lacked modern 'circuit breakers' to halt trading.",
        keywords: ["black monday", "1987", "crash", "program trading", "computerized"],
    },
    {
        question: "How did World War I impact Wall Street?",
        answer: "World War I transformed the United States from a debtor nation into the world's leading creditor nation and financial center, displacing London. To finance the war, the U.S. government issued 'Liberty Bonds' to the public. This massive marketing campaign introduced millions of ordinary Americans to securities investing for the first time, dramatically expanding the future investor base for Wall Street.",
        keywords: ["world war i", "wwi", "liberty bonds", "creditor nation", "financial center"],
    },
    {
        question: "What was the impact of the telegraph on Wall Street?",
        answer: "The telegraph, introduced in the 1840s, was revolutionary for Wall Street. It allowed for near-instantaneous communication of stock prices and news between New York and other cities, replacing the slow mail and messenger system. This led to the creation of the stock ticker in 1867, which transmitted continuous price data and synchronized the national market, enabling faster and more widespread trading.",
        keywords: ["telegraph", "stock ticker", "innovation", "communication", "market speed"],
    },
    {
        question: "How did the Cold War shape Wall Street?",
        answer: "The Cold War fueled massive government spending in defense, aerospace, and technology (the 'space race'), creating entire industries that became staples of Wall Street investment. Companies like Boeing, Raytheon, and early tech firms benefited immensely. The ideological battle between capitalism and communism also positioned Wall Street as a symbol of American economic power and prosperity.",
        keywords: ["cold war", "defense spending", "aerospace", "technology", "capitalism"],
    },
    {
        question: "What was the Panic of 1907 and how did it change Wall Street?",
        answer: "The Panic of 1907 was a severe financial crisis triggered by a failed attempt to corner the market in United Copper Company stock. The resulting bank runs and credit crunch threatened to collapse the entire financial system. The crisis was ultimately halted by the private intervention of banker J.P. Morgan, who organized liquidity for banks. This event highlighted the need for a central bank, directly leading to the creation of the Federal Reserve System in 1913.",
        keywords: ["panic of 1907", "jp morgan", "federal reserve", "central bank", "bank run"],
    },
    {
        question: "Will Wall Street ever disappear?",
        answer: "The form will evolve, but the function — connecting capital and ideas — will always exist in some shape.",
        keywords: ["disappear", "future", "technology", "evolution"],
    },

    // PART 2 – Culture & Perception
    {
        question: "Are all Wall Street professionals 'greedy bankers'?",
        answer: "Myth: Everyone on Wall Street is a ruthless, greedy banker. Fact: The industry is vast, including analysts, researchers, compliance officers, IT specialists, and traders. While high compensation is common, many roles are focused on research, risk management, and technology, not just high-stakes deal-making. The 'greedy banker' stereotype is an oversimplification.",
        keywords: ["stereotype", "greedy banker", "culture", "roles"],
    },
    {
        question: "What is the 'Wall Street vs. Main Street' narrative?",
        answer: "Myth: Wall Street and Main Street are eternal enemies. Fact: This narrative frames Wall Street's interests (profits, market gains) as being in direct opposition to the interests of everyday people (jobs, stable economy). While their priorities can conflict (e.g., a company laying off workers to boost its stock price), they are also deeply codependent. Main Street's savings and pensions fuel Wall Street, and Wall Street's capital allocation funds Main Street businesses.",
        keywords: ["wall street vs main street", "narrative", "conflict", "codependent"],
    },
    {
        question: "Is Wall Street run by a secret society like the Illuminati?",
        answer: "Myth: A secret cabal controls all financial markets. Fact: This is a popular conspiracy theory. While Wall Street is an insular world with powerful, well-connected individuals, its movements are driven by the collective actions of millions of participants, complex algorithms, and broad economic forces—not a secret society with a master plan. The system is chaotic and emergent, not centrally controlled.",
        keywords: ["conspiracy", "secret society", "illuminati", "control", "myth"],
    },
    {
        question: "How does media portray finance versus the day-to-day reality?",
        answer: "Myth: Wall Street life is like 'The Wolf of Wall Street'—non-stop parties and fraud. Fact: Movies and news focus on the most extreme examples of fraud, greed, and drama. The reality for most is long hours spent in front of spreadsheets, research reports, and compliance documents. The job is more often tedious and analytical than cinematic.",
        keywords: ["media portrayal", "movies", "wolf of wall street", "reality", "culture"],
    },
    {
        question: "Is everyone on Wall Street a Republican?",
        answer: "Myth: Wall Street is a monolithic conservative voting bloc. Fact: While the industry as a whole tends to favor policies like lower capital gains taxes and deregulation, its employees hold diverse political views. Donations flow to both Republican and Democratic parties, often strategically. Many younger employees in finance lean more socially liberal, even if fiscally conservative.",
        keywords: ["politics", "republican", "democrat", "donations", "culture"],
    },
    {
        question: "Do Wall Street traders actually yell 'Buy! Buy! Buy!'?",
        answer: "Myth: Trading floors are full of people screaming orders. Fact: This is a relic of the past. Today, over 90% of trading is electronic. The few remaining trading floors are much quieter, used for high-touch orders or as television backdrops. Most traders work in silence, executing trades via computer terminals.",
        keywords: ["trading floor", "yelling", "buy sell", "electronic trading", "culture"],
    },
    {
        question: "Is the 'Gordon Gekko' philosophy ('Greed is good') still dominant?",
        answer: "Myth: 'Greed is good' is the official motto. Fact: While profit is the primary motive, the post-2008 era has seen a significant shift. There is now a much greater emphasis on risk management, compliance, and public perception. Furthermore, the rise of ESG (Environmental, Social, and Governance) investing shows a growing, if sometimes cynical, focus on factors beyond pure profit.",
        keywords: ["gordon gekko", "greed is good", "philosophy", "esg", "culture"],
    },
    {
        question: "Why is there a 'bull' and 'bear' statue on Wall Street?",
        answer: "Myth: They were put there by the city to represent the market. Fact: The 'Charging Bull' statue was an act of guerrilla art by Arturo Di Modica in 1989, installed without permission to symbolize the strength and resilience of the American people after the 1987 crash. It became so popular it was made permanent. The 'Fearless Girl' statue was added much later (2017) by an investment firm to promote a gender diversity fund.",
        keywords: ["charging bull", "fearless girl", "statue", "art", "symbol"],
    },
    {
        question: "Is Wall Street culture all about expensive suits and Rolex watches?",
        answer: "Myth: You need a luxury wardrobe to fit in. Fact: This stereotype is more aligned with senior investment bankers and old-school brokers. In modern finance, especially in hedge funds and quantitative trading, the culture is far more casual. Many 'quants' and tech-focused traders wear hoodies and sneakers, prioritizing performance over appearance.",
        keywords: ["culture", "dress code", "suits", "rolex", "quant"],
    },
    {
        question: "Do people on Wall Street work 100-hour weeks?",
        answer: "Myth: Everyone works insane hours all the time. Fact: This is largely true for junior investment banking analysts, who often work 80-100+ hours a week during their first few years. However, in other roles like sales, research, or asset management, the hours can be more manageable, though still demanding compared to a standard 9-to-5 job.",
        keywords: ["work hours", "100-hour week", "investment banking", "work-life balance"],
    },
    // ... (40 more Q&A for Part 2 will be generated here)
];
