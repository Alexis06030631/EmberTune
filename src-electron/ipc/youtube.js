import { charts } from 'ytmusic_api_unofficial/dist/index.js'
import { addMusicsToCache, get, search } from './../utils/ytRequests.js'
import { ipcMain } from 'electron'

ipcMain.handle('getCharts', async (event, country) => {
  try {
    if (!country || country === 'ZZ') {
      country = 'US'
    }
    const results = await charts(country)
    return JSON.parse(JSON.stringify(results))
  } catch (error) {
    console.error('Get Charts Error:', error)
    throw error
  }
})

ipcMain.handle('getArtistDetails', async (event, id) => {
  try {
    const artistdetails = {
      artist: null,
      albums: [],
      songs: [],
    }
    const artist = await get(id)
    artistdetails.artist = artist
    artistdetails.albums = await artist.getAlbums()
    artistdetails.songs = await artist.getSongs()
    return JSON.parse(JSON.stringify(artistdetails))
  } catch (error) {
    console.error('Get Artist Details Error:', error)
    throw error
  }
})

ipcMain.handle('search', async (event, query, country) => {
  const results = {
    songs: [],
    artists: [],
    albums: [],
    playlists: [],
  }
  try {
    const songs = await search(query, 'SONG', {
      country: country,
      fetch: false,
    })
    results.songs = songs.content
  } catch (error) {
    console.error('Search Error:', error)
    results.songs = []
  }
  try {
    const artists = await search(query, 'ARTIST', {
      country: country,
      fetch: true,
    })
    results.artists = artists.content
  } catch (error) {
    console.error('Search Error:', error)
    results.artists = []
  }
  try {
    const albums = await search(query, 'ALBUM', {
      country: country,
      fetch: false,
    })
    results.albums = albums.content
  } catch (error) {
    console.error('Search Error:', error)
    results.albums = []
  }
  try {
    const playlists = await search(query, 'PLAYLIST', {
      country: country,
      fetch: false,
    })
    results.playlists = playlists.content
  } catch (error) {
    console.error('Search Error:', error)
    results.playlists = []
  }
  return JSON.parse(JSON.stringify(results))
})

ipcMain.handle('download', async (event, id) => {
  try {
    const song = await get(id)
    return JSON.parse(JSON.stringify(await song.download('webm')))
  } catch (error) {
    console.error('Download Error:', error)
    throw error
  }
})

ipcMain.handle('getObject', async (event, id) => {
  try {
    const object = await get(id)
    return JSON.parse(JSON.stringify(object))
  } catch (error) {
    console.error('Get Object Error:', error)
    throw error
  }
})

ipcMain.handle('getRelatives', async (event, id) => {
  try {
    const music = await get(id)
    const relatives = await music.getRadioPlaylist()
    relatives.musics.shift()
    addMusicsToCache(relatives.musics)
    return JSON.parse(JSON.stringify(relatives)).musics
  } catch (error) {
    console.error('Get Relatives Error:', error)
    throw error
  }
})

ipcMain.handle('getLyrics', async (event, id) => {
  try {
    const song = await get(id)
    const lyrics = await song.getLyrics()
    return JSON.parse(JSON.stringify(lyrics))
  } catch (error) {
    console.error('Get Lyrics Error:', error)
    throw error
  }
})
