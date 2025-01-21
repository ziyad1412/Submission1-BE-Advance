const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");

class AlbumsService {
  constructor() {
    this._albums = [];
    this._songsService = null; // SongsService instance to access songs data
  }

  setSongsService(songsService) {
    this._songsService = songsService;
  }

  addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;
    const newAlbum = { id, name, year };

    this._albums.push(newAlbum);

    const isSuccess = this._albums.some((album) => album.id === id);
    if (!isSuccess) {
      throw new InvariantError("Album gagal ditambahkan");
    }

    return id;
  }

  getAlbums() {
    return this._albums;
  }

  getAlbumById(id) {
    const album = this._albums.find((album) => album.id === id);
    if (!album) {
      throw new NotFoundError("Album tidak ditemukan");
    }
    return album;
  }

  getAlbumDetailWithSongs(id) {
    const album = this.getAlbumById(id);

    if (!this._songsService) {
      throw new Error("SongsService belum diatur.");
    }

    const songs = this._songsService.getSongsByAlbumId(id);

    return { ...album, songs };
  }

  editAlbumById(id, { name, year }) {
    const index = this._albums.findIndex((album) => album.id === id);

    if (index === -1) {
      throw new NotFoundError("Gagal memperbarui album. Id tidak ditemukan");
    }

    this._albums[index] = { ...this._albums[index], name, year };
  }

  deleteAlbumById(id) {
    const index = this._albums.findIndex((album) => album.id === id);

    if (index === -1) {
      throw new NotFoundError("Album gagal dihapus. Id tidak ditemukan");
    }

    this._albums.splice(index, 1);
  }
}

module.exports = AlbumsService;
