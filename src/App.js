import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles.css";

import viacepAPI from "./services/viacepAPI";
import apiCEP from "./services/apiCEP";

function App() {
  const [input, setInput] = useState("");
  const [cep, setCep] = useState({});

  const notifyEmptyMessage = (message, type) => {
    if (type === "W") {
      toast.warn(message, {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else if (type === "S") {
      toast.success(message, {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else if (type === "E") {
      toast.error(message, {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else if (type === "I") {
      toast.info(message, {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      toast(message, {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  async function handleSearch() {
    if (input === "") {
      notifyEmptyMessage("Preencha com um CEP...", "W");
      return;
    }

    try {
      const response = await viacepAPI.get(`${input}/json`);
      if (!response.data.erro) {
        setCep(response.data);
        notifyEmptyMessage(`Veja acima informações sobre ${input}`, "S");
      } else {
        const responseSecondTry = await apiCEP.get(`${input}.json`);
        if (responseSecondTry.data.ok) {
          setCep({
            cep: responseSecondTry.data.code,
            logradouro: responseSecondTry.data.address,
            bairro: responseSecondTry.data.district,
            complemento: "não informado",
            localidade: responseSecondTry.data.city,
            uf: responseSecondTry.data.state,
          });
          notifyEmptyMessage(`Veja acima informações sobre ${input}`, "S");
        } else {
          notifyEmptyMessage(
            `Aconteceu algum problema para o cep ${input}...`,
            "E"
          );
        }
      }
      setInput("");
    } catch (error) {
      notifyEmptyMessage(`O cep ${input} não existe`, "E");
      setInput("");
    }
  }

  return (
    <div className="container">
      <h1 className="title">Buscador de CEP</h1>

      <div className="containerInput">
        <input
          type="text"
          placeholder="Digite seu cep..."
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyUp={(e) => (e.key === "Enter" ? handleSearch() : {})}
        />

        <button className="buttonSearch" onClick={handleSearch}>
          <FiSearch size={25} color="#FFF" />
        </button>
        <ToastContainer
          theme="dark"
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>

      {Object.keys(cep).length > 0 && (
        <main className="main">
          <h2> CEP: {cep.cep}</h2>
          <span>{cep.logradouro}</span>
          <span>Complemento: {cep.complemento} </span>
          <span> {cep.bairro} </span>
          <span>
            {" "}
            {cep.localidade} - {cep.uf}
          </span>
        </main>
      )}
    </div>
  );
}

export default App;
