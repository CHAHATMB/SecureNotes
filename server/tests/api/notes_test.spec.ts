import app from "../../src/app";
import chai from "chai";
import chaiHttp from "chai-http";
import "mocha";
import NoteCollection from "../../src/models/Notes/NotesCollection";

chai.use(chaiHttp);

const expect = chai.expect;

describe("Notes", () => {
  afterEach((done) => {
    NoteCollection.remove({}, (err) => {
      done();
    });
  });
  /*
   * Test the /GET route
   */
  describe("/GET notes", () => {
    it("it should GET all the notes", (done) => {
      chai
        .request(app)
        .get("/api/notes")
        .end((err, res) => {
          expect(err).to.be.null;
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });

  describe("/POST note", () => {
    it("it should POST a note ", (done) => {
      const note = {
        title: "The Lord of the Rings",
        content: "J.R.R. Tolkien",
      };
      chai
        .request(app)
        .post("/api/notes")
        .send(note)
        .end((err, res) => {
          expect(err).to.be.null;
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("title").eql("The Lord of the Rings");
          res.body.should.have.property("content").eql("J.R.R. Tolkien");
          done();
        });
    });
  });
  /*
   * Test the /GET/:id route
   */
  describe("/GET/:id note", () => {
    it("it should GET a note by the given id", (done) => {
      const note = new NoteCollection({
        title: "The Lord of the Rings",
        content: "J.R.R. Tolkien",
      });
      note.save((err, note) => {
        chai
          .request(app)
          .get("/api/notes/" + note.id)
          .send(note)
          .end((err, res) => {
            expect(err).to.be.null;
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("title");
            res.body.should.have.property("content").eql("J.R.R. Tolkien");
            res.body.should.have.property("_id").eql(note.id);
            done();
          });
      });
    });
  });

  describe("/PUT/:id note", () => {
    it("it should UPDATE a note given the id", (done) => {
      const note = new NoteCollection({
        title: "The Chronicles of Narnia",
        content: "C.S. Lewis",
      });
      note.save((err, note) => {
        chai
          .request(app)
          .put("/api/notes/" + note.id)
          .send({ title: "The Chronicles of Narnia", content: "Jackson" })
          .end((err, res) => {
            expect(err).to.be.null;
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("title");
            res.body.should.have.property("content");
            done();
          });
      });
    });
  });
  /*
   * Test the /DELETE/:id route
   */
  describe("/DELETE/:id note", () => {
    it("it should DELETE a note given the id", (done) => {
      const note = new NoteCollection({
        title: "The Chronicles of Narnia",
        content: "C.S. Lewis",
      });
      note.save((err, note) => {
        chai
          .request(app)
          .delete("/api/notes/" + note.id)
          .end((err, res) => {
            expect(err).to.be.null;
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have
              .property("message")
              .eql("Note successfully deleted!");
            done();
          });
      });
    });
  });
});
