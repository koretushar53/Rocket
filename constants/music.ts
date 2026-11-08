import type { ImageSourcePropType } from 'react-native';

export type Song = {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  file: number;
  accent: string;
  cover?: ImageSourcePropType;
  featured?: boolean;
};

export function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds)) return '--:--';
  if (seconds <= 0) return '0:00';
  return `${Math.floor(seconds / 60)}:${Math.floor(seconds % 60).toString().padStart(2, '0')}`;
}

export const songs: Song[] = [
  {
    id: 'yeh-fitoor-mera',
    title: 'Yeh Fitoor Mera',
    artist: 'Arijit Singh, Amit Trivedi',
    album: 'Fitoor',
    duration: 283,
    file: require('../assets/songs/01 Yeh Fitoor Mera - Fitoor (Arijit Singh) 190Kbps.mp3'),
    accent: '#A855F7',
    cover: require('../assets/images/music-covers/yeh-fitoor-mera.jpg'),
  },
  {
    id: 'dancin',
    title: 'Dancin (KRONO Remix)',
    artist: 'Aaron Smith, KRONO',
    album: 'Dancin',
    duration: 256,
    file: require('../assets/songs/Aaron Smith - Dancin (KRONO Remix).mp3'),
    accent: '#06B6D4',
    cover: require('../assets/images/music-covers/dancin.jpg'),
    featured: true,
  },
  {
    id: 'paro',
    title: 'Paro',
    artist: "Aditya Rikhari, UNPLG'd",
    album: 'Paro',
    duration: 70,
    file: require('../assets/songs/Aditya Rikhari, UNPLG d - Paro.mp3'),
    accent: '#F97316',
    cover: require('../assets/images/music-covers/paro.jpg'),
  },
  {
    id: 'teri-yaad',
    title: 'Teri Yaad',
    artist: 'Aditya Rikhari',
    album: 'Teri Yaad',
    duration: 239,
    file: require('../assets/songs/aditya-rikhari-teri-yaad-lyrics-aw-lyrics-adityarikhari-lyrics-teriyaad-128-ytshorts.savetube.me.mp3'),
    accent: '#EC4899',
  },
  {
    id: 'all-the-stars',
    title: 'All The Stars',
    artist: 'Kendrick Lamar, SZA',
    album: 'Black Panther: The Album',
    duration: 230,
    file: require('../assets/songs/All The Stars (with SZA) - Kendrick Lamar.mp3'),
    accent: '#EF4444',
    cover: require('../assets/images/music-covers/all-the-stars.png'),
    featured: true,
  },
  {
    id: 'am-i-dreaming',
    title: 'Am I Dreaming',
    artist: 'Metro Boomin, A$AP Rocky, Roisee',
    album: 'Spider-Man: Across the Spider-Verse',
    duration: 256,
    file: require('../assets/songs/Am I Dreaming (Metro Boomin & A$AP Rocky, Roisee).mp3'),
    accent: '#8B5CF6',
    cover: require('../assets/images/music-covers/am-i-dreaming.jpg'),
  },
  {
    id: 'as-it-was',
    title: 'As It Was',
    artist: 'Harry Styles',
    album: "Harry's House",
    duration: 166,
    file: require('../assets/songs/As It Was by Harry Styles .mp3'),
    accent: '#F43F5E',
  },
  {
    id: 'rasputin',
    title: 'Rasputin',
    artist: 'Boney M.',
    album: 'Nightflight to Venus',
    duration: 266,
    file: require('../assets/songs/Boney M - Rasputin.mp3'),
    accent: '#F59E0B',
    cover: require('../assets/images/music-covers/rasputin.jpg'),
  },
  {
    id: 'dilliwaali-girlfriend',
    title: 'Dilliwaali Girlfriend',
    artist: 'Arijit Singh, Sunidhi Chauhan',
    album: 'Yeh Jawaani Hai Deewani',
    duration: 261,
    file: require('../assets/songs/Dilliwaali Girlfriend Yeh Jawaani Hai Deewani 320 Kbps.mp3'),
    accent: '#FB7185',
  },
  {
    id: 'end-of-beginning',
    title: 'End Of Beginning',
    artist: 'Djo',
    album: 'DECIDE',
    duration: 159,
    file: require('../assets/songs/Djo - End Of Beginning (Official Audio).mp3'),
    accent: '#A855F7',
    featured: true,
  },
  {
    id: 'i-think-they-call-this-love-elliot',
    title: 'I Think They Call This Love',
    artist: 'Elliot James Reay',
    album: 'I Think They Call This Love',
    duration: 194,
    file: require('../assets/songs/Elliot James Reay-01-I Think They Call This Love.mp3'),
    accent: '#EAB308',
    cover: require('../assets/images/music-covers/i-think-they-call-this-love-elliot.jpg'),
  },
  {
    id: 'ilahi',
    title: 'Ilahi',
    artist: 'Arijit Singh, Pritam',
    album: 'Yeh Jawaani Hai Deewani',
    duration: 229,
    file: require('../assets/songs/Ilahi Yeh Jawaani Hai Deewani 128 Kbps.mp3'),
    accent: '#22C55E',
  },
  {
    id: 'ishqa-ve',
    title: 'Ishqa Ve',
    artist: 'Zeeshan Ali',
    album: 'Ishqa Ve',
    duration: 229,
    file: require('../assets/songs/Ishqa Ve(KoshalWorld.Com).mp3'),
    accent: '#F472B6',
    cover: require('../assets/images/music-covers/ishqa-ve.jpg'),
  },
  {
    id: 'on-the-floor',
    title: 'On The Floor',
    artist: 'Jennifer Lopez, Pitbull',
    album: 'Love?',
    duration: 266,
    file: require('../assets/songs/Jennifer Lopez  On The Floor ft Pitbull.mp3'),
    accent: '#D946EF',
  },
  {
    id: 'kashish',
    title: 'Kashish',
    artist: 'Ashish Bhatia, Omkar Singh, Kashish Ratnani',
    album: 'Kashish',
    duration: 193,
    file: require('../assets/songs/Kashish - Ashish Bhatia.mp3'),
    accent: '#0EA5E9',
    cover: require('../assets/images/music-covers/kashish.jpg'),
  },
  {
    id: 'i-think-they-call-this-love-matthew',
    title: 'I Think They Call This Love',
    artist: 'Matthew Ifield',
    album: 'I Think They Call This Love (Cover)',
    duration: 196,
    file: require('../assets/songs/Matthew_Ifield_-_I_Think_They_Call_This_Love_-_Cover_(mp3.pm).mp3'),
    accent: '#F97316',
  },
  {
    id: 'perfect',
    title: 'Perfect',
    artist: 'Ed Sheeran',
    album: '÷ (Divide)',
    duration: 263,
    file: require('../assets/songs/Perfect - Ed Sheeran.mp3'),
    accent: '#14B8A6',
    cover: require('../assets/images/music-covers/perfect.jpg'),
  },
  {
    id: 'gone-gone-gone',
    title: 'Gone, Gone, Gone',
    artist: 'Phillip Phillips',
    album: 'The World from the Side of the Moon',
    duration: 223,
    file: require('../assets/songs/Phillip Phillips - Gone, Gone, Gone.mp3'),
    accent: '#F43F5E',
  },
  {
    id: 'shape-of-you',
    title: 'Shape of You',
    artist: 'Ed Sheeran',
    album: '÷ (Divide)',
    duration: 235,
    file: require('../assets/songs/Shape of You - Ed Sheeran.mp3'),
    accent: '#6366F1',
    cover: require('../assets/images/music-covers/shape-of-you.png'),
  },
  {
    id: 'tu-hi-mera',
    title: 'Tu Hi Mera',
    artist: 'Shafqat Amanat Ali, Pritam',
    album: 'Jannat 2',
    duration: 273,
    file: require('../assets/songs/Tu Hi Mera Jannat 2 Original Motion Picturetrack 128 Kbps.mp3'),
    accent: '#3B82F6',
  },
  {
    id: 'zulfein',
    title: 'Zulfein',
    artist: 'Mehul Mahesh',
    album: 'Zulfein',
    duration: 199,
    file: require('../assets/songs/Zulfein - Mehul Mahesh.mp3'),
    accent: '#D946EF',
    cover: require('../assets/images/music-covers/zulfein.jpg'),
  },
];

export const featuredSong = songs.find((song) => song.featured) ?? songs[0];
