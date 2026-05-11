import { useNavigate } from "react-router-dom";
import "./style.scss";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="notfound">
      <div className="notfound__content">
        <h1 className="notfound__code glitch" data-text="404">
          404
        </h1>

        <h2 className="notfound__title">Page Not Found</h2>

        <p className="notfound__desc">
          The page you are looking for might have been removed or does not exist.
        </p>

        <button className="notfound__btn" onClick={() => navigate("/")}>
          Go back home
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
