class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
  }

  // Handler add song
  async postSongHandler(request, h) {
    this._validator.validateSongPayload(request.payload);
    const songId = await this._service.addSong(request.payload);

    return h
      .response({
        status: "success",
        data: { songId },
      })
      .code(201);
  }

  // Handler get songs
  async getSongsHandler(request) {
    const { title, performer } = request.query; // Ambil query parameter
    const songs = await this._service.getSongs({ title, performer }); // Oper ke service

    return {
      status: "success",
      data: {
        songs,
      },
    };
  }

  // Handler get song by id
  async getSongByIdHandler(request) {
    const { id } = request.params;
    const song = await this._service.getSongById(id);

    return { status: "success", data: { song } };
  }

  // Handler edit song by id
  async putSongByIdHandler(request) {
    const { id } = request.params;
    this._validator.validateSongPayload(request.payload);
    await this._service.editSongById(id, request.payload);

    return { status: "success", message: "Lagu berhasil diperbarui" };
  }

  // Handler delete song by id
  async deleteSongByIdHandler(request) {
    const { id } = request.params;
    await this._service.deleteSongById(id);

    return { status: "success", message: "Lagu berhasil dihapus" };
  }
}

module.exports = SongsHandler;
