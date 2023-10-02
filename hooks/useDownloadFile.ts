const useDownloadFile = () => {
  const downloadFile = async (
    filePath: string,
    extension: string,
    fileName: string
  ) => {
    return fetch(filePath, {
      method: "GET",
      headers: {
        "Content-Type": extension,
      },
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));

        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;

        document.body.appendChild(link);

        link.click();
        if (link.parentNode) {
          link.parentNode.removeChild(link);
        }
      }).catch((err: any) => {
        console.log("err", err)
      })
  };

  return { downloadFile };
};

export default useDownloadFile;
