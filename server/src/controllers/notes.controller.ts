import express, {
  RequestHandler,
  Request,
  Response,
  NextFunction,
} from "express";
import { validationResult } from "express-validator";
import { validationErrorResponse } from "./utils";
import mongoose from "mongoose";
import NoteDocument from "../models/Notes/NotesDocument";
import NoteCollection from "../models/Notes/NotesCollection";

export const getNotes: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // res.status(200).json({ message: "YO" });
  NoteCollection.find()
    .exec()
    .then((notes: NoteDocument[] | null) => {
      if (!notes) {
        return Promise.reject(res.status(401).end());
      }

      res.status(200).json(notes);
    })
    .catch((error: Response) => {
      return next(error);
    });
};

export const getNote: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await NoteCollection.findById(req.params.id)
    .exec()
    .then((notes: NoteDocument | null) => {
      if (!notes) {
        return Promise.reject(res.status(401).end());
      }

      res.status(200).json(notes);
    })
    .catch((error: Response) => {
      return next(error);
    });
};

export const createNote: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const invalid: Response | false = validationErrorResponse(
    res,
    validationResult(req)
  );

  if (invalid) {
    return invalid;
  }
  const note: NoteDocument = new NoteCollection({
    title: req.body.title,
    content: req.body.content,
  });

  note
    .save()
    // eslint-disable-next-line
    .then((saved: any | null) => {
      return res.status(200).json(saved);
    })
    .catch((error: Response) => {
      return next(error);
    });
};

export const updateNote: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const invalid: Response | false = validationErrorResponse(
      res,
      validationResult(req)
    );
    if (invalid) {
      return invalid;
    }
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res
        .status(404)
        .json({ error: `No notes with id: ${req.params.id}` });
    }
    const notes = await NoteCollection.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      content: req.body.content,
    }).exec();

    return res.status(200).json(notes);
  } catch (error) {
    return Promise.reject(res.status(404).json({ message: error.message }));
  }
};

export const deleteNote: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await NoteCollection.findById(req.params.id)
    .exec()
    .then((note: NoteDocument | null) => {
      if (!note) {
        return Promise.reject(
          res.status(404).json({ message: "Note not found! " })
        );
      }
      NoteCollection.findByIdAndDelete(req.params.id)
        .exec()
        .then(() => {
          return res
            .status(200)
            .json({ message: "Note successfully deleted!" });
        });
    })
    .catch((error: Response) => {
      return next(error);
    });
};
