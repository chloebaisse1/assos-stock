import React from "react";

interface Props {
  name: string;
  description: string;
  loading: boolean;
  onclose: () => void;
  onChangeName: (value: string) => void;
  onChangeDescription: (value: string) => void;
  onSubmit: () => void;
  editMode?: boolean;
}

const CategoryModal: React.FC<Props> = ({
  name,
  description,
  loading,
  onclose,
  onChangeName,
  onChangeDescription,
  onSubmit,
  editMode,
}) => {
  return (
    <div>
      <dialog id="category-modal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button
              onClick={onclose}
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">
            {editMode ? "Modifier la catégorie" : "Créer une catégorie"}
          </h3>
          <input
            type="text"
            placeholder="Nom"
            value={name}
            onChange={(e) => onChangeName(e.target.value)}
            className="input input-bordered w-full mb-4"
          />

          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => onChangeDescription(e.target.value)}
            className="input input-bordered w-full mb-4"
          />

          <button className="btn btn-secondary" onClick={onSubmit}>
            {loading
              ? editMode
                ? "Modifier"
                : "Créer"
              : editMode
              ? "Modifier"
              : "Créer"}
          </button>
        </div>
      </dialog>
    </div>
  );
};

export default CategoryModal;
