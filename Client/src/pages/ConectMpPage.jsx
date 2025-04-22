export const ConectMpPage = ({user}) => {
    const [params] = useSearchParams();
    const [isConnecting, setIsConnecting] = useState(false);
  
    useEffect(() => {
      const code = params.get("code");
      const token = localStorage.getItem("token");
      const code_verifier = localStorage.getItem("mp_code_verifier");
  
      console.log("user:", user);
  
      if (code && token && code_verifier && user && user._id) {
        setIsConnecting(true);
        
        axios.post("https://reservaapp-zg71.onrender.com/api/mercadopago/token", {
          code,
          code_verifier,
          userId_body: user._id
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(res => {
          console.log("✅ Cuenta conectada", res.data);
          setIsConnecting(false);
        })
        .catch(err => {
          console.log(err);
          console.error("❌ Error al conectar", err.response?.data || err.message);
          setIsConnecting(false);
        });
      }
    }, [params, user]);  
  
    if (!user) {
      return <p>Cargando información del usuario...</p>;
    }
  
    return <p>{isConnecting ? "Conectando con Mercado Pago..." : "Listo para conectar con Mercado Pago"}</p>;
  };