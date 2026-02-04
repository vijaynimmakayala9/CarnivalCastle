import Modal from "react-bootstrap/Modal";

const PopupModal = ({ show, handleClose, image }) => {
  if (!image) return null;

  const imageURL = `https://api.carnivalcastle.com/${image}`;

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      size="md"
    >
      <Modal.Body
        className="p-0"
        style={{ position: "relative" }}
      >
        {/* CLOSE BUTTON */}
        <button
          onClick={handleClose}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            width: "35px",
            height: "35px",
            borderRadius: "50%",
            border: "none",
            background: "rgba(0,0,0,0.6)",
            color: "#fff",
            fontSize: "20px",
            cursor: "pointer",
            zIndex: 10,
          }}
        >
          &times;
        </button>

        {/* POPUP IMAGE */}
        <img
          src={imageURL}
          alt="popup"
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            objectFit: "cover",
          }}
        />
      </Modal.Body>
    </Modal>
  );
};

export default PopupModal;
