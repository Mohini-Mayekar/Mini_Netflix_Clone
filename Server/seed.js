import { dbConnection, closeConnection } from './config/mongoConnection.js';
import { shows } from './config/mongoCollections.js';
import dotenv from "dotenv";

dotenv.config();

const sampleShows = [
    {
        id: "1",
        title: "Stranger Things",
        description: "Kids uncover supernatural mysteries in their small town in the 1980s.",
        genre: "Sci-Fi, Horror",
        rating: "TV-14",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BMDZkYmVhNjMtNWU4MC00MDQxLWE3MjYtZGMzZWI1ZjhlOWJmXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=b9EkMc79ZSU"
    },
    {
        id: "2",
        title: "The Mandalorian",
        description: "A lone bounty hunter navigates the galaxy's outer reaches.",
        genre: "Sci-Fi, Western",
        rating: "TV-14",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BZDhlMzY0ZGItZTcyNS00ZTAxLWIyMmYtZGQ2ODg5OWZiYmJkXkEyXkFqcGdeQXVyODkzNTgxMDg@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=aOC8E8z_ifw"
    },
    {
        id: "3",
        title: "Breaking Bad",
        description: "A chemistry teacher turns to cooking meth to secure his family's future.",
        genre: "Crime, Drama",
        rating: "TV-MA",
        thumbnail: "https://example.com/breaking.jpg",
        videoUrl: "https://www.youtube.com/watch?v=HhesaQXLuRY"
    },
    {
        id: "4",
        title: "The Witcher",
        description: "A monster hunter struggles to find his place in a world where people often prove more wicked than beasts.",
        genre: "Fantasy, Adventure",
        rating: "TV-MA",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BOGE4MmVjMDgtMzIzYy00NjEwLWJlODMtMDI1MGY2ZDlhMzE2XkEyXkFqcGdeQXVyMzY0MTE3NzU@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=ndl1W4ltcmg"
    },
    {
        id: "5",
        title: "Game of Thrones",
        description: "Noble families fight for control of the Iron Throne in the Seven Kingdoms of Westeros.",
        genre: "Fantasy, Drama",
        rating: "TV-MA",
        thumbnail: "https://example.com/got.jpg",
        videoUrl: "https://www.youtube.com/watch?v=KPLWWIOCOOQ"
    },
    {
        id: "6",
        title: "The Boys",
        description: "Vigilantes take on corrupt superheroes in a world where fame trumps morality.",
        genre: "Action, Satire",
        rating: "TV-MA",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BOTEyNDJhMDAtY2U5ZS00OTMzLTkwODktMjU3MjFkZWVlMGYyXkEyXkFqcGdeQXVyMjkwOTAyMDU@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=M1bhOaLV4FU"
    },
    {
        id: "7",
        title: "The Crown",
        description: "Chronicles the reign of Queen Elizabeth II and the events that shaped the second half of the 20th century.",
        genre: "Historical Drama",
        rating: "TV-MA",
        thumbnail: "https://example.com/theCrown.jpg",
        videoUrl: "https://www.youtube.com/watch?v=JWtnJjn6ng0"
    },
    {
        id: "8",
        title: "Peaky Blinders",
        description: "A notorious gang in 1919 Birmingham rises to power under the leadership of Tommy Shelby.",
        genre: "Crime, Historical",
        rating: "TV-MA",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BMTkzNjEzMDEzMF5BMl5BanBnXkFtZTgwMDI0MjE4MjE@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=oVzVdvGIC7U"
    },
    {
        id: "9",
        title: "The Office (US)",
        description: "A mockumentary on the mundane lives of office employees at Dunder Mifflin Paper Company.",
        genre: "Comedy",
        rating: "TV-14",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BMDNkOTE4NDQtMTNmYi00MWE0LWE4ZTktYTc0NzhhNWIzNzJiXkEyXkFqcGdeQXVyMzQ2MDI5NjU@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=Ua0lf2g0QOQ"
    },
    {
        id: "10",
        title: "Friends",
        description: "Follows the lives of six reckless adults living in Manhattan.",
        genre: "Comedy, Romance",
        rating: "TV-14",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BNDVkYjU0MzctMWRmZi00NTkxLTgwZWEtOWVhYjZlYjllYmU4XkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=hDNNmeeJs1Q"
    },
    {
        id: "11",
        title: "The Simpsons",
        description: "The satiric adventures of a working-class family in the misfit city of Springfield.",
        genre: "Animation, Comedy",
        rating: "TV-PG",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BYjFjMTlkODUtYTNlNy00M2YwLWFjYjktMWMzOWNlYTllY2I4XkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=P3YNvn4xibQ"
    },
    {
        id: "12",
        title: "The Queen's Gambit",
        description: "Orphaned in the 1950s, a female chess prodigy struggles with addiction in a quest to become the greatest player in the world.",
        genre: "Drama",
        rating: "TV-MA",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BM2k3ZTE2ZTEtM2ZhZi00NDZhLTkyOGMtNjIzMzA1NjFkZWY5XkEyXkFqcGdeQXVyMDA4NzEzNzU@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=CDrieqwSdgI"
    },
    {
        id: "13",
        title: "Sherlock",
        description: "A consulting detective solves various mysteries in modern-day London.",
        genre: "Crime, Drama, Mystery, Thriller",
        rating: "TV-14",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BMGMyNzY1OTg4MF5BMl5BanBnXkE0ZTcwNjk3NzQ1OQ@@._V1_FMjpg_UX1000_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=9Tc9d3KlxDY"
    },
    {
        id: "14",
        title: "Rick and Morty",
        description: "An animated series that follows the exploits of a super scientist and his not-so-bright grandson.",
        genre: "Animation, Adventure, Comedy, Sci-Fi",
        rating: "TV-MA",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BZjRjOTFkOTktZWUzMi00NzQ0LTg0ZjAtYWJhNmJkM2IxZTNhXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=Wkx0K76iOEs"
    },
    {
        id: "15",
        title: "Black Mirror",
        description: "An anthology series exploring a twisted, high-tech multiverse where humanity's greatest innovations and darkest instincts collide.",
        genre: "Drama, Sci-Fi, Thriller",
        rating: "TV-MA",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BNzg3MjI4MjkxN15BMl5BanBnXkFtZTgwNzg3OTQ4NjM@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=jDiYGjp5Kjw"
    },
    {
        id: "16",
        title: "Brooklyn Nine-Nine",
        description: "Comedy series following the exploits of Det. Jake Peralta and his diverse, lovable colleagues as they police the NYPD's 99th Precinct.",
        genre: "Comedy, Crime",
        rating: "TV-14",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BNzVkYWY4NzYtMWFlZi00YzkwLThhZDItZjcxYTU4ZTMzMDZmXkEyXkFqcGdeQXVyODUxOTU0OTg@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=sEOuJ4z5aTc"
    },
    {
        id: "17",
        title: "The Big Bang Theory",
        description: "A woman who moves into an apartment across the hall from two brilliant but socially awkward physicists shows them how little they know about life outside of the laboratory.",
        genre: "Comedy, Romance",
        rating: "TV-14",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BY2FmZTY5YTktOWRlYy00NmIyLWE0ZmQtZDg2YjlmMzczZDZiXkEyXkFqcGdeQXVyNjg4NzAyOTA@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=WBb3fojgW0Q"
    },
    {
        id: "18",
        title: "Money Heist",
        description: "An unusual group of robbers attempt to carry out the most perfect robbery in Spanish history - stealing 2.4 billion euros from the Royal Mint of Spain.",
        genre: "Action, Crime, Drama",
        rating: "TV-MA",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BNDJkYzY3MzMtMGFhYi00MmQ4LWJkNTgtZGNiZWZmMTMxNzdlXkEyXkFqcGdeQXVyMTEyMjM2NDc2._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=htqXL94Rza4"
    },
    {
        id: "19",
        title: "Daredevil",
        description: "A blind lawyer by day, vigilante by night. Matt Murdock fights against injustice as Daredevil in New York City's Hell's Kitchen.",
        genre: "Action, Crime, Drama",
        rating: "TV-MA",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BNTAyODUzOTg0NF5BMl5BanBnXkFtZTgwMzg3Mzg4MjI@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=jAy6NJ_D5vU"
    },
    {
        id: "20",
        title: "The Umbrella Academy",
        description: "A family of former child heroes, now grown apart, must reunite to solve the mystery of their father's death and the threat of an impending apocalypse.",
        genre: "Action, Adventure, Comedy, Drama",
        rating: "TV-14",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BOTk3YjA4YzQtNGM5OS00N2UwLThhYzQtYzliNWI2ZTI3N2QxXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=0DAmWHxeoKw"
    },
    {
        id: "21",
        title: "Succession",
        description: "The Roy family, owners of a global media empire, fight for control of the company as their father's health declines.",
        genre: "Drama",
        rating: "TV-MA",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BZTY0NzQ3YWQtYjQ2MC00YWNlLWEwM2ItYWI5ZTk1MzA2OWQ3XkEyXkFqcGdeQXVyNjY1MTg4Mzc@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=OzYxJV_rmE8"
    },
    {
        id: "22",
        title: "Wednesday",
        description: "Wednesday Addams navigates her new school Nevermore Academy, where she attempts to master her psychic powers and solve a supernatural mystery.",
        genre: "Comedy, Crime, Fantasy",
        rating: "TV-14",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BZjFjOTFjODAtYjM1OS00YzkyLTk2ZTMtMmQzZDI1ZjA2NDYxXkEyXkFqcGdeQXVyMTM1MTE1NDMx._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=Di310WS8zLk"
    },
    {
        id: "23",
        title: "Yellowstone",
        description: "The Dutton family, owners of the largest ranch in Montana, face constant attacks from land developers, politicians, and Native American reservations.",
        genre: "Drama, Western",
        rating: "TV-MA",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BMGE1MzEzNzEtZDEyMC00NDk4LThhMjItYzU1NzhiZDM2NmU2XkEyXkFqcGdeQXVyMTU2NTcyMg@@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=V8f6F9aRTl0"
    },
    {
        id: "24",
        title: "The Last of Us",
        description: "After a global pandemic destroys civilization, a hardened survivor takes charge of a 14-year-old girl who may be humanity's last hope.",
        genre: "Action, Adventure, Drama",
        rating: "TV-MA",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BZGUzYTI3M2EtZmM0Yy00NGUyLWI4ODEtN2Q3ZGJlYzhhZjU3XkEyXkFqcGdeQXVyMTM1MTE1NDMx._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=uLtkt8BonwM"
    },
    {
        id: "25",
        title: "Only Murders in the Building",
        description: "Three strangers obsessed with true crime suddenly find themselves wrapped up in one when they investigate a death in their exclusive Upper West Side apartment building.",
        genre: "Comedy, Crime, Mystery",
        rating: "TV-14",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BODA0NTFlYWUtYTE1Zi00YzBlLTkzMDYtM2I2NzAxNmY2ZGM5XkEyXkFqcGdeQXVyMTM1MTE1NDMx._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=7zqJZp6WgWk"
    },
    {
        id: "26",
        title: "The Bear",
        description: "A young chef from the fine dining world returns to Chicago to run his family's sandwich shop after a heartbreaking death in the family.",
        genre: "Comedy, Drama",
        rating: "TV-MA",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BMDE0Y2VkMzctOWViZi00YzU5LTljYjktYmJhOTY5ZmVjOTYxXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=Ri89-w6DKh4"
    },
    {
        id: "27",
        title: "Severance",
        description: "Mark leads a team at Lumon Industries where employees have undergone a severance procedure to surgically divide their work and personal memories.",
        genre: "Drama, Mystery, Sci-Fi, Thriller",
        rating: "TV-MA",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BMjkwZjcwMGQtNDAzOC00YjdhLThkZTUtNWJkYWM1NDVmOTkyXkEyXkFqcGdeQXVyMTM1MTE1NDMx._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=xEQP4VVuyrY"
    },
    {
        id: "28",
        title: "Ted Lasso",
        description: "An American football coach is hired to manage an English soccer team despite having no experience, bringing his folksy charm to the Premier League.",
        genre: "Comedy, Drama, Sport",
        rating: "TV-MA",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BMDVmODUzNmEtMGMxZC00NWUzLTkxMTAtMDM5OTQzMWE0ZTM3XkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=3u7EIiohs6U"
    },
    {
        id: "29",
        title: "The White Lotus",
        description: "Anthology series following the exploits of various guests and employees at a tropical resort over the span of a week.",
        genre: "Comedy, Drama",
        rating: "TV-MA",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BZDQyYzBkY2MtNTBmNC00MjYyLThjYTYtOWI3M2IxM2M0OWMxXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=TGLBhHWSI6w"
    },
    {
        id: "30",
        title: "Andor",
        description: "Prequel series to Star Wars' 'Rogue One' following thief-turned-rebel spy Cassian Andor during the formative years of the Rebellion.",
        genre: "Action, Adventure, Drama, Sci-Fi",
        rating: "TV-14",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BNDgxNTIyZTMtMzYxNi00NmRjLWFiZDMtNWIyMzU1MDA2ODQ3XkEyXkFqcGdeQXVyMTM1MTE1NDMx._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=cKNShjd8Hzk"
    },
    {
        id: "31",
        title: "The Marvelous Mrs. Maisel",
        description: "A housewife in the late 1950s discovers her talent for stand-up comedy and decides to pursue a career in it.",
        genre: "Comedy, Drama",
        rating: "TV-MA",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BMTU5MzQxMjUwMV5BMl5BanBnXkFtZTgwNjY3NjU4MjI@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=6fnGHWgMlVg"
    },
    {
        id: "32",
        title: "Killing Eve",
        description: "A cat-and-mouse game between an MI6 agent and a psychopathic assassin.",
        genre: "Action, Drama, Thriller",
        rating: "TV-MA",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BMjE2MzQzNzctNjU4My00MzQ4LWJlZjctMzU4YmQxMjU5NzQwXkEyXkFqcGdeQXVyMjM4NTM5NDY@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=8p0t3DZ6vqU"
    },
    {
        id: "33",
        title: "Westworld",
        description: "Set at the intersection of the near future and the reimagined past, it explores a world in which every human appetite can be indulged.",
        genre: "Drama, Mystery, Sci-Fi, Western",
        rating: "TV-MA",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BMjJlYjE2ZDYtYmI4Mi00MGYwLWIzOTgtNWQxMWYzNmRiMTljXkEyXkFqcGdeQXVyMjM4NTM5NDY@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=IuS5N3PdQHg"
    },
    {
        id: "34",
        title: "Better Call Saul",
        description: "The trials and tribulations of small-time lawyer Jimmy McGill in the years before he established his strip-mall law office in Albuquerque, New Mexico.",
        genre: "Crime, Drama",
        rating: "TV-MA",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BMTQ5NDYxNzY1OV5BMl5BanBnXkFtZTgwNTMyNjg4MTI@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=HhesaQXLuRY"
    },
    {
        id: "35",
        title: "This Is Us",
        description: "Follows the lives of the Pearson family across multiple timelines.",
        genre: "Drama, Family, Romance",
        rating: "TV-14",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BMTQ4MjQwNDgtMzU5Mi00MzNhLWE2NjEtMzQxZDg4NmQ3MzlhXkEyXkFqcGdeQXVyMjM4NTM5NDY@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=3FaPJXFkI9o"
    },
    {
        id: "36",
        title: "The Handmaid's Tale",
        description: "Set in a dystopian near-future, the story follows the life of Offred, a Handmaid forced into reproductive servitude.",
        genre: "Drama, Sci-Fi",
        rating: "TV-MA",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BZjViMjU4MzktZjQwZS00MjQ3LWEwZjItYzYwYjQ5ZjQ3YjUzXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=CE0AOBaujiA"
    },
    {
        id: "37",
        title: "Ozark",
        description: "A financial advisor drags his family from Chicago to the Missouri Ozarks, where he must launder money to appease a drug boss.",
        genre: "Crime, Drama, Thriller",
        rating: "TV-MA",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BMjMxNjU3NDcxMV5BMl5BanBnXkFtZTgwNzg3OTQ4NjM@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=Xr2DyXz2M9g"
    },
    {
        id: "38",
        title: "Narcos",
        description: "The true story of the rise and fall of the Medellín cartel and its infamous leader, Pablo Escobar.",
        genre: "Biography, Crime, Drama",
        rating: "TV-MA",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BMTU3NjQzMDUxMV5BMl5BanBnXkFtZTgwNzY4NDU5NjM@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=VXy0Xq3zYkE"
    },
    {
        id: "39",
        title: "Schitt's Creek",
        description: "A wealthy family is forced to rebuild their lives in a small town they purchased as a joke.",
        genre: "Comedy",
        rating: "TV-14",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BZDc3NjU4NzEtNmQ1ZS00NmQ4LWEwZjUtMzQ0YzU1MzQ5ZjMzXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=9d3n8sZf2lQ"
    },
    {
        id: "40",
        title: "The Good Doctor",
        description: "A young surgeon with autism and Savant syndrome is recruited into the pediatric surgical unit of a prestigious hospital.",
        genre: "Drama",
        rating: "TV-14",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BMjE3NDUxNjQ4OF5BMl5BanBnXkFtZTgwNDU3NzU3MjI@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=0RzF9zqzr1g"
    },
    {
        id: "41",
        title: "Euphoria",
        description: "A look at the lives of a group of high school students as they navigate love, friendships, and identity in a world of social media and peer pressure.",
        genre: "Drama",
        rating: "TV-MA",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BZDQyYzBiOTQtNGM5OS00N2UwLThhYzQtYzliNWI2ZTI3N2QxXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=QDqg5f9zTqo"
    },
    {
        id: "42",
        title: "The Expanse",
        description: "In a future where humanity has colonized the Solar System, a detective and a rogue ship's captain uncover a conspiracy that threatens the fragile balance of power.",
        genre: "Drama, Mystery, Sci-Fi",
        rating: "TV-14",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BMjE3NDUxNjQ4OF5BMl5BanBnXkFtZTgwNDU3NzU3MjI@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=oeAbisBCmjI"
    },
    {
        id: "43",
        title: "The Haunting of Hill House",
        description: "Flashing between past and present, a fractured family confronts haunting memories of their old home and the traumatic events that drove them apart.",
        genre: "Drama, Horror, Mystery",
        rating: "TV-MA",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BMTU5ODI5MzQ4NF5BMl5BanBnXkFtZTgwNzY4NDU5NjM@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=G9OzG2jL3lo"
    },
    {
        id: "44",
        title: "Russian Doll",
        description: "A woman keeps reliving the same night, as she tries to figure out what is happening to her and how to escape the time loop.",
        genre: "Comedy, Drama, Mystery",
        rating: "TV-MA",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BZDc3NjU4NzEtNmQ1ZS00NmQ4LWEwZjUtMzQ0YzU1MzQ5ZjMzXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=1eHqG9u8r1c"
    },
    {
        id: "45",
        title: "Fleabag",
        description: "A comedy series that follows the life of a dry-witted woman navigating modern life in London.",
        genre: "Comedy, Drama",
        rating: "TV-MA",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BZDc3NjU4NzEtNmQ1ZS00NmQ4LWEwZjUtMzQ0YzU1MzQ5ZjMzXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=5xKuBw7YzrQ"
    },
    {
        id: "46",
        title: "Chernobyl",
        description: "In April 1986, a safety test gone wrong led to a catastrophic explosion at the Chernobyl nuclear power plant.",
        genre: "Drama, History, Thriller",
        rating: "TV-MA",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BZDc3NjU4NzEtNmQ1ZS00NmQ4LWEwZjUtMzQ0YzU1MzQ5ZjMzXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=s9APLXM9Ei8"
    },
    {
        id: "47",
        title: "The 100",
        description: "Set 97 years after a nuclear apocalypse that wiped out nearly all life on Earth, the series follows a group of survivors as they return to Earth.",
        genre: "Drama, Mystery, Sci-Fi",
        rating: "TV-14",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BMTQ4MjQwNDgtMzU5Mi00NWUzLTkxMTAtMDM5OTQzMWE0ZTM3XkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=1JCsFI6e1HQ"
    },
    {
        id: "48",
        title: "The Good Fight",
        description: "The spin-off of 'The Good Wife,' following Diane Lockhart as she joins a new law firm.",
        genre: "Drama",
        rating: "TV-MA",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BZDc3NjU4NzEtNmQ1ZS00NmQ4LWEwZjUtMzQ0YzU1MzQ5ZjMzXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=7zqJZp6WgWk"
    },
    {
        id: "49",
        title: "The Man in the High Castle",
        description: "In a dystopian America, the Nazis have won World War II and the country is divided between the Greater Nazi Reich and the Japanese Pacific States.",
        genre: "Drama, Sci-Fi, Thriller",
        rating: "TV-MA",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BZDc3NjU4NzEtNmQ1ZS00NmQ4LWEwZjUtMzQ0YzU1MzQ5ZjMzXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=3PQVJ8oH9Jc"
    },
    {
        id: "50",
        title: "Outlander",
        description: "A World War II nurse is transported back in time to Scotland in the year 1743, where she becomes embroiled in the Jacobite uprising.",
        genre: "Drama, Fantasy, Romance",
        rating: "TV-MA",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BZDc3NjU4NzEtNmQ1ZS00NmQ4LWEwZjUtMzQ0YzU1MzQ5ZjMzXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=1D3PjYo6dKg"
    },
    {
        id: "51",
        title: "Inception",
        description: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.",
        genre: "Action, Sci-Fi, Thriller",
        rating: "PG-13",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=8hYlB38asDY"
    },
    {
        id: "52",
        title: "The Shawshank Redemption",
        description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
        genre: "Drama",
        rating: "R",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=6hB3S9bIaco"
    },
    {
        id: "53",
        title: "The Dark Knight",
        description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, the caped crusader must come to terms with one of the greatest psychological tests of his ability to fight injustice.",
        genre: "Action, Crime, Thriller",
        rating: "PG-13",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=EXeTwQWrcwY"
    },
    {
        id: "54",
        title: "The Lord of the Rings: The Return of the King",
        description: "Gandalf and Aragorn lead the World of Men against Sauron's army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.",
        genre: "Adventure, Drama, Fantasy",
        rating: "PG-13",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BNzA5ZDMwNWEtMzBmYS00ZDBhLTg0ZjktZWNhIgQ2ZGY1NzRjXkEyXkFqcGdeQXVyNDUzOTQ5MjY@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=r5X-hFfO7Jc"
    },
    {
        id: "55",
        title: "Pulp Fiction",
        description: "The lives of two mob hitmen, a boxer, a gangster's wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
        genre: "Crime, Drama",
        rating: "R",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BMTkxMTA5OTAzMl5BMl5BanBnXkFtZTgwNjA5MDc3NjM@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=s7EdHQvZGM4"
    },
    {
        id: "56",
        title: "The Matrix",
        description: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against machines.",
        genre: "Action, Sci-Fi",
        rating: "R",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0ZC00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=m8e-FF8MsqU"
    },
    {
        id: "57",
        title: "Forrest Gump",
        description: "Forrest Gump, while not intelligent, has a heart of gold and a strong sense of justice, which leads him to become involved in some of the most significant events of the 20th century.",
        genre: "Drama, Romance",
        rating: "PG-13",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmNhMGEwZWUyNzNhXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=uBJ5y_HU8C0"
    },
    {
        id: "58",
        title: "The Silence of the Lambs",
        description: "A young FBI agent seeks the advice of imprisoned serial killer Hannibal Lecter to apprehend another serial killer known as Buffalo Bill.",
        genre: "Crime, Drama, Thriller",
        rating: "R",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BNjNhZTk0ZmEtNjJhMi00YzFlLWE1MmEtYzM1M2ZmMGMwMTU4XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=W6Mm8Sbe__o"
    },
    {
        id: "59",
        title: "Interstellar",
        description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival as Earth faces environmental disaster.",
        genre: "Adventure, Drama, Sci-Fi",
        rating: "PG-13",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BMjIxNTU4NTEyMF5BMl5BanBnXkFtZTgwMzM4ODI3MjE@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=0vxOhd4qlnA"
    },
    {
        id: "60",
        title: "Joker",
        description: "A mentally unstable comedian becomes obsessed with a talk show host and descends into madness, becoming the Joker.",
        genre: "Crime, Drama, Thriller",
        rating: "R",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BNGVjNWI4ZGUtNzE0MS00YTJmLWE0ZDctN2ZmYTk3M2FlN2I0XkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=t433PEQGErc"
    },
    {
        id: "61",
        title: "Parasite",
        description: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
        genre: "Comedy, Drama, Thriller",
        rating: "R",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=5xH0HfJHsaY"
    },
    {
        id: "62",
        title: "Everything Everywhere All at Once",
        description: "An aging Chinese immigrant is swept up in an insane adventure where she alone can save existence by exploring other universes connecting with the lives she could have led.",
        genre: "Action, Adventure, Comedy",
        rating: "R",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BYTdiOTIyZTQtNmQ1OS00NjZlLWIyMTgtYzk5Y2M3ZDVmNjdkXkEyXkFqcGdeQXVyMTAzMDg4NzU0._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=wxN1T1uxQ2g"
    },
    {
        id: "63",
        title: "The Social Network",
        description: "Harvard student Mark Zuckerberg creates the social networking site that would become known as Facebook, but is later sued by two brothers who claimed he stole their idea.",
        genre: "Biography, Drama",
        rating: "PG-13",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BOGUyZDUxZjEtMmIzMC00MzlmLTg4MGItZWJmMzBhZjE0Mjc1XkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=lB95KLmpLR4"
    },
    {
        id: "64",
        title: "La La Land",
        description: "While navigating their careers in Los Angeles, a pianist and an actress fall in love while attempting to reconcile their aspirations for the future.",
        genre: "Comedy, Drama, Music",
        rating: "PG-13",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BMzUzNDM2NzM2MV5BMl5BanBnXkFtZTgwNTM3NTg4OTE@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=0pdqf4P9MB8"
    },
    {
        id: "65",
        title: "Whiplash",
        description: "A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an instructor who will stop at nothing to realize a student's potential.",
        genre: "Drama, Music",
        rating: "R",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BOTA5NDZlZGUtMjAxOS00YTRkLTkwYmMtYWQ0NWEwZDZiNjEzXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=7d_jQycdQGo"
    },
    {
        id: "66",
        title: "Get Out",
        description: "A young African-American visits his white girlfriend's parents for the weekend, where his simmering uneasiness about their reception of him eventually reaches a boiling point.",
        genre: "Horror, Mystery, Thriller",
        rating: "R",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BMjUxMDQwNjcyNl5BMl5BanBnXkFtZTgwNzcwMzc0MTI@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v/DzfpyUB60YY"
    },
    {
        id: "67",
        title: "Mad Max: Fury Road",
        description: "In a post-apocalyptic wasteland, a woman rebels against a tyrannical ruler in search for her homeland with the aid of a group of female prisoners, a psychotic worshiper, and a drifter named Max.",
        genre: "Action, Adventure, Sci-Fi",
        rating: "R",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BN2EwM2I5OWMtMGQyMi00Zjg1LWJkNTctZTdjYTA4OGUwZjMyXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v/hEJnMQG9ev8"
    },
    {
        id: "68",
        title: "The Grand Budapest Hotel",
        description: "The adventures of Gustave H, a legendary concierge at a famous European hotel between the wars, and Zero Moustafa, the lobby boy who becomes his most trusted friend.",
        genre: "Adventure, Comedy, Crime",
        rating: "R",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BMzM5NjUxOTEyMl5BMl5BanBnXkFtZTgwNjEyMDM0MDE@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=1Fg5iWmQjwk"
    },
    {
        id: "69",
        title: "Birdman",
        description: "A washed-up superhero actor attempts to revive his fading career by writing, directing, and starring in a Broadway production.",
        genre: "Comedy, Drama",
        rating: "R",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BODZkY2RlZjctYTk1Ny00Yjc2LWEwYjItNTE0NzY4MTlkY2I0XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=uJfLoE6hanc"
    },
    {
        id: "70",
        title: "Moonlight",
        description: "A young African-American man grapples with his identity and sexuality while experiencing the everyday struggles of childhood, adolescence, and burgeoning adulthood.",
        genre: "Drama",
        rating: "R",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BNzQxNTIyODAxMV5BMl5BanBnXkFtZTgwNzQyMDA3OTE@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=9NJj12tJzqc"
    },
    {
        id: "71",
        title: "The Shape of Water",
        description: "At a top-secret research facility in the 1960s, a mute janitor forms a unique relationship with an amphibious creature being held in captivity.",
        genre: "Drama, Fantasy, Romance",
        rating: "R",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BNGNiNWQ5M2MtNGI0OC00MDA2LWI5NzEtMmZiYjVjMDEyOWYzXkEyXkFqcGdeQXVyMjM4NTM5NDY@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=XFYW1blaV_A"
    },
    {
        id: "72",
        title: "Blade Runner 2049",
        description: "A young blade runner's discovery of a long-buried secret leads him to track down former blade runner Rick Deckard, who's been missing for thirty years.",
        genre: "Sci-Fi, Thriller",
        rating: "R",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BNzA1Njg4NzYxOV5BMl5BanBnXkFtZTgwODk5NjU3MzI@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=gCcx85zbxz4"
    },
    {
        id: "73",
        title: "The Favourite",
        description: "In early 18th century England, a frail Queen Anne occupies the throne and her close friend Lady Sarah governs the country in her stead.",
        genre: "Biography, Comedy, Drama",
        rating: "R",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BMTk3NTM2NjQxOV5BMl5BanBnXkFtZTgwODk1MjAwNzM@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=SYb-wkehT1g"
    },
    {
        id: "74",
        title: "Arrival",
        description: "A linguist works with the military to communicate with alien lifeforms after twelve mysterious spacecraft appear around the world.",
        genre: "Drama, Sci-Fi",
        rating: "PG-13",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BNGU0NTA2YjctYWNlYy00ZDg1LTg5ZTItZWM3MWZiY2VlOTVlXkEyXkFqcGdeQXVyNTM0NTU5Mg@@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=tFMo3UJ4B4g"
    },
    {
        id: "75",
        title: "Hereditary",
        description: "A grieving family is haunted by tragic and disturbing occurrences after the death of their secretive grandmother.",
        genre: "Horror, Mystery, Thriller",
        rating: "R",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BOTU5MDg3OGItZWQ1Ny00ZGVmLTg2YTUtMzBkYzQ1YWIwZjlhXkEyXkFqcGdeQXVyNTAzMTY4MDA@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=V6wWKNij_1M"
    },
    {
        id: "76",
        title: "Knives Out",
        description: "A detective investigates the death of a patriarch of an eccentric, combative family.",
        genre: "Comedy, Crime, Drama",
        rating: "PG-13",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BMGUwZjliMTAtNzAxZi00MWNiLWE2NzgtZGUxMGQxZjhhNDRiXkEyXkFqcGdeQXVyNjU1NzU3MzE@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=sL-9Khv7wa4"
    },
    {
        id: "77",
        title: "The Lobster",
        description: "In a dystopian near future, single people must find a mate in 45 days or be transformed into animals.",
        genre: "Comedy, Drama, Romance",
        rating: "R",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BNDQ1NDE5NzQ1NF5BMl5BanBnXkFtZTgwNzA5OTM2NTE@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=vU29VfayDMw"
    },
    {
        id: "78",
        title: "A Quiet Place",
        description: "In a post-apocalyptic world, a family must live in silence to avoid mysterious creatures that hunt by sound.",
        genre: "Drama, Horror, Sci-Fi",
        rating: "PG-13",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BMjI0MDMzNTQ0M15BMl5BanBnXkFtZTgwMTM5NjM5NDM@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=p9wE8dyzEJE"
    },
    {
        id: "79",
        title: "Call Me By Your Name",
        description: "In 1980s Italy, a 17-year-old begins a relationship with his father's research assistant.",
        genre: "Drama, Romance",
        rating: "R",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BNDk3NTEwNjc0MV5BMl5BanBnXkFtZTgwNzYxNTMwMzI@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=Z9AYPxH5NTM"
    },
    {
        id: "80",
        title: "Nightcrawler",
        description: "A driven young man stumbles upon the underground world of freelance crime journalism in Los Angeles.",
        genre: "Crime, Drama, Thriller",
        rating: "R",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BN2U1YzdhYWMtZWUzNC00ODIxLWE3M2EtMGViY2IzM2NjYWVkXkEyXkFqcGdeQXVyNjE5MjIyNTg@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=X8kYDQan8bw"
    },
    {
        id: "81",
        title: "Nomadland",
        description: "A woman in her sixties embarks on a journey through the American West after losing everything in the Great Recession, living as a van-dwelling modern-day nomad.",
        genre: "Drama",
        rating: "R",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BMDRiZWUxNmItNDU5Yy00ODNmLTk0M2ItZjQzZTA5YTJmM2ZiXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=6sxCFZ8_d84"
    },
    {
        id: "82",
        title: "Dune",
        description: "A noble family becomes embroiled in a war for control over the galaxy's most valuable asset while its heir becomes troubled by visions of a dark future.",
        genre: "Sci-Fi, Adventure",
        rating: "PG-13",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BN2FjNmEyNWMtYzM0ZS00NjIyLTg5YzYtYThlMGVjNzE1OGViXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=8g18jFHCLXk"
    },
    {
        id: "83",
        title: "The Power of the Dog",
        description: "Charismatic rancher Phil Burbank inspires fear and awe in those around him, but when his brother brings home a new wife and her son, Phil reveals buried vulnerabilities.",
        genre: "Western, Drama",
        rating: "R",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BZGRhYjE2NWUtN2FkNy00NGI3LTkxYWMtMDk4Yjg5ZjU4ZGU1XkEyXkFqcGdeQXVyMTEyMjM2NDc2._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=ELvLwNq3N8A"
    },
    {
        id: "84",
        title: "Minari",
        description: "A Korean-American family moves to an Arkansas farm in search of their own American Dream, testing the family's resilience in a new and different land.",
        genre: "Drama",
        rating: "PG-13",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BOTYzMzBjZDQtYTUxZS00N2QzLTgxMTAtM2IxOTQ0YjBlN2JmXkEyXkFqcGdeQXVyNjY1MTg4Mzc@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=KQ0gFidlro8"
    },
    {
        id: "85",
        title: "Portrait of a Lady on Fire",
        description: "In 18th-century France, a painter develops an intimate relationship with a young woman who must marry a nobleman.",
        genre: "Drama, Romance",
        rating: "R",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BNjgwNjkwOWYtYmM3My00NzI1LTk1OGUtZDg2ZDEyNzEyZTZmXkEyXkFqcGdeQXVyODQzNTE3ODc@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=R-fQPTwma9o"
    },
    {
        id: "86",
        title: "Uncut Gems",
        description: "A charismatic jeweler makes a high-stakes bet that could lead to the windfall of a lifetime—or cripple his business, family, and lifelong passions.",
        genre: "Crime, Drama, Thriller",
        rating: "R",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BZDhkMjUyYjItYWVkYi00YTM5LWE4MGEtY2FlMjA2OGU2OTZmXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=vTfJp2Ts9X8"
    },
    {
        id: "87",
        title: "The Irishman",
        description: "Hitman Frank Sheeran recalls his involvement in the slaying of union leader Jimmy Hoffa, navigating the criminal underworld of post-war America.",
        genre: "Biography, Crime, Drama",
        rating: "R",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BMGUyM2ZiZmUtMWY0OC00NTQ4LThkOGUtNjY1N2I5M2Q1NjQ5XkEyXkFqcGdeQXVyMzY0MTE3NzU@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=WHXxVmeGQUc"
    },
    {
        id: "88",
        title: "Soul",
        description: "A jazz musician stuck in a mediocre job gets the chance of a lifetime but must find his way back to Earth after an accident transports his soul to the `Great Before.`",
        genre: "Animation, Adventure, Comedy",
        rating: "PG",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BZGE1MDg5M2MtNTkyZS00MTY5LTg1YzUtZTlhZmM1Y2EwNmFmXkEyXkFqcGdeQXVyNjA3OTI0MDc@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=xOsLIiBStEs"
    },
    {
        id: "89",
        title: "Promising Young Woman",
        description: "A woman traumatized by a tragic event seeks vengeance against those who wronged her.",
        genre: "Crime, Drama, Thriller",
        rating: "R",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BOTgzMzE4MGItZDgxYS00ZGEwLWE3YTctZWY3ZDA2MTJjN2M0XkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=7i5kiFDunk8"
    },
    {
        id: "90",
        title: "Another Round",
        description: "Four high school teachers launch a drinking experiment to test a theory that maintaining a constant alcohol level makes life better.",
        genre: "Comedy, Drama",
        rating: "R",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BOTk2OTY2NzgtYzVjZS00YjFkLThhN2QtODViN2JjYjg0ZGE1XkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=BzTrKkgxQHk"
    },
    {
        id: "91",
        title: "The Worst Person in the World",
        description: "A young woman navigates love, career, and personal growth in modern Oslo while struggling to find her true purpose.",
        genre: "Comedy, Drama, Romance",
        rating: "R",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BMDdlYjA1NjktY2RmNi00ZDliLTk1ZTAtZTBkMWVmNjNhYzFjXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=BuypGk84QeI"
    },
    {
        id: "92",
        title: "Drive My Car",
        description: "A grieving theater director forms an unexpected bond with his young chauffeur while staging a multilingual production of Chekhov's 'Uncle Vanya.'",
        genre: "Drama",
        rating: "PG-13",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BOTdmNTFjODctOWYzMC00M2Y1LThhZDMtOWYzNWJjODFmZGE5XkEyXkFqcGdeQXVyNTA3NzcwOTM@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=6BPKPb_RTwI"
    },
    {
        id: "93",
        title: "RRR",
        description: "A fictional tale of two Indian revolutionaries' friendship and their fight against British colonial rule in the 1920s.",
        genre: "Action, Drama, History",
        rating: "TV-MA",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BODUwNDNjYzctODUxNy00ZTA2LWIyYTEtMDc5Y2E5ZjBmNTMzXkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=Yg9kK1WZi9w"
    },
    {
        id: "94",
        title: "Tár",
        description: "A renowned conductor's career and personal life unravel amid allegations of misconduct.",
        genre: "Drama, Music",
        rating: "R",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BM2I0ZDcyYzItMGEyNi00YzBkLTlmMGYtMWFmMzU2ZTc1ODJlXkEyXkFqcGdeQXVyMTUzOTcyODA5._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=Naqq6t6x6Bs"
    },
    {
        id: "95",
        title: "The Banshees of Inisherin",
        description: "Two lifelong friends on a remote Irish island find themselves at an awkward impasse when one abruptly ends their relationship.",
        genre: "Comedy, Drama",
        rating: "R",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BYjZhYmQyZTItYTI5OS00NjE2LWI1ZjgtOTY1NWQ5NjJiZGM1XkEyXkFqcGdeQXVyMTUzOTcyODA5._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=uRu3zLOJN2c"
    },
    {
        id: "96",
        title: "Decision to Leave",
        description: "A detective investigating a man's death becomes entangled with the dead man's mysterious wife in this Hitchcockian thriller.",
        genre: "Crime, Drama, Mystery",
        rating: "PG-13",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BNGU3Y2IwYTAtOGNhMi00ODU4LTk2ZGMtZGQ1MWY5YjYwYjVjXkEyXkFqcGdeQXVyMTUzOTcyODA5._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=z1HZy3ik0dM"
    },
    {
        id: "97",
        title: "Top Gun: Maverick",
        description: "After more than 30 years of service as a Navy pilot, Pete 'Maverick' Mitchell returns to train a new generation of pilots for a dangerous mission.",
        genre: "Action, Drama",
        rating: "PG-13",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BZWYzOGEwNTgtNWU3NS00ZTQ0LWJkODUtMmVhMjIwMjA1ZmQwXkEyXkFqcGdeQXVyMjkwOTAyMDU@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=giXco2jakz8"
    },
    {
        id: "98",
        title: "The Batman",
        description: "A reclusive Bruce Wayne uncovers corruption in Gotham City while pursuing the Riddler, a serial killer targeting the city's elite.",
        genre: "Action, Crime, Drama",
        rating: "PG-13",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BMDdmMTBiNTYtMDIzNi00NGVlLWIzMDYtZTk3MTQ3NGQxZGEwXkEyXkFqcGdeQXVyMzMwOTU5MDk@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=mqqft2x_Aa4"
    },
    {
        id: "99",
        title: "Triangle of Sadness",
        description: "A satirical look at wealth and power as a luxury cruise for the ultra-rich descends into chaos.",
        genre: "Comedy, Drama",
        rating: "R",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BNDRiZjc0ZDMtMjlhZS00MzQyLWJjNjMtOWRiZjFhMGUxN2I4XkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=1q7e1eM3j1k"
    },
    {
        id: "100",
        title: "Everything Everywhere All at Once",
        description: "A middle-aged Chinese immigrant is swept into an insane adventure where she alone can save existence by exploring parallel universes.",
        genre: "Action, Adventure, Comedy",
        rating: "R",
        thumbnail: "https://m.media-amazon.com/images/M/MV5BYTdiOTIyZTQtNmQ1OS00NjZlLWIyMTgtYzk5Y2M3ZDVmNjdkXkEyXkFqcGdeQXVyMTAzMDg4NzU0._V1_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=wxN1T1uxQ2g"
    }
];

const seedDB = async () => {
    try {
        const db = await dbConnection();
        await db.dropDatabase();
        console.log("Connected to MongoDB");

        const showsCollection = await shows();

        await showsCollection.insertMany(sampleShows);
        console.log("Sample Shows Inserted");

    } catch (err) {
        console.error("Error Seeding Database:", err);
    } finally {
        await closeConnection();
        console.log("MongoDB Connection Closed");
    }
};

seedDB();



