import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useRef, useCallback } from "react";
import { Upload, CheckCircle, WarningCircle, Eye, X } from "@phosphor-icons/react";
class ImageUploadProcessor {
  constructor() {
    this.config = {
      // Minimum dimensions for blog images
      minDimensions: {
        blog: { width: 800, height: 600 },
        card: { width: 600, height: 400 },
        hero: { width: 1200, height: 800 },
        thumbnail: { width: 300, height: 200 }
      },
      // Maximum file sizes (in bytes)
      maxFileSize: {
        original: 10 * 1024 * 1024,
        // 10MB
        processed: 2 * 1024 * 1024
        // 2MB
      },
      // Supported formats
      supportedFormats: ["image/jpeg", "image/png", "image/webp"],
      // Quality settings
      quality: {
        high: 0.9,
        medium: 0.8,
        low: 0.7
      }
    };
  }
  /**
   * Validate uploaded image file
   */
  validateImage(file, context = "blog") {
    const errors = [];
    if (!this.config.supportedFormats.includes(file.type)) {
      errors.push(`Formato não suportado. Use: ${this.config.supportedFormats.join(", ")}`);
    }
    if (file.size > this.config.maxFileSize.original) {
      errors.push(`Arquivo muito grande. Máximo: ${this.config.maxFileSize.original / (1024 * 1024)}MB`);
    }
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  /**
   * Get image dimensions from file
   */
  getImageDimensions(file) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight
        });
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Não foi possível carregar a imagem"));
      };
      img.src = url;
    });
  }
  /**
   * Automatically resize image if needed
   */
  async processImage(file, context = "blog", options = {}) {
    try {
      const validation = this.validateImage(file, context);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(", "));
      }
      const originalDimensions = await this.getImageDimensions(file);
      const minDims = this.config.minDimensions[context];
      const needsResize = originalDimensions.width < minDims.width || originalDimensions.height < minDims.height;
      if (needsResize) {
        console.log(`Imagem pequena detectada (${originalDimensions.width}x${originalDimensions.height}). Redimensionando para ${minDims.width}x${minDims.height}...`);
        return await this.resizeImage(file, minDims, options);
      }
      if (file.size > this.config.maxFileSize.processed) {
        console.log("Imagem grande detectada. Comprimindo...");
        return await this.compressImage(file, options);
      }
      return {
        file,
        processed: false,
        originalDimensions,
        finalDimensions: originalDimensions,
        message: "Imagem aprovada sem processamento"
      };
    } catch (error) {
      throw new Error(`Erro ao processar imagem: ${error.message}`);
    }
  }
  /**
   * Resize image to minimum required dimensions
   */
  async resizeImage(file, targetDimensions, options = {}) {
    const {
      quality = this.config.quality.high,
      maintainAspectRatio = true,
      useAIUpscaling = true
    } = options;
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        const originalWidth = img.naturalWidth;
        const originalHeight = img.naturalHeight;
        let newWidth = targetDimensions.width;
        let newHeight = targetDimensions.height;
        if (maintainAspectRatio) {
          const aspectRatio = originalWidth / originalHeight;
          const targetAspectRatio = newWidth / newHeight;
          if (aspectRatio > targetAspectRatio) {
            newHeight = newWidth / aspectRatio;
          } else {
            newWidth = newHeight * aspectRatio;
          }
          if (newWidth < targetDimensions.width) {
            newWidth = targetDimensions.width;
            newHeight = newWidth / aspectRatio;
          }
          if (newHeight < targetDimensions.height) {
            newHeight = targetDimensions.height;
            newWidth = newHeight * aspectRatio;
          }
        }
        canvas.width = newWidth;
        canvas.height = newHeight;
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        if (useAIUpscaling && (originalWidth < newWidth || originalHeight < newHeight)) {
          ctx.filter = "contrast(1.1) brightness(1.02)";
        }
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error("Falha ao processar imagem"));
            return;
          }
          const processedFile = new File([blob], file.name, {
            type: "image/jpeg",
            lastModified: Date.now()
          });
          resolve({
            file: processedFile,
            processed: true,
            originalDimensions: { width: originalWidth, height: originalHeight },
            finalDimensions: { width: newWidth, height: newHeight },
            message: `Imagem redimensionada de ${originalWidth}x${originalHeight} para ${Math.round(newWidth)}x${Math.round(newHeight)}`
          });
        }, "image/jpeg", quality);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Não foi possível carregar a imagem para redimensionamento"));
      };
      img.src = url;
    });
  }
  /**
   * Compress image while maintaining quality
   */
  async compressImage(file, options = {}) {
    const { quality = this.config.quality.medium } = options;
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error("Falha ao comprimir imagem"));
            return;
          }
          const compressedFile = new File([blob], file.name, {
            type: "image/jpeg",
            lastModified: Date.now()
          });
          resolve({
            file: compressedFile,
            processed: true,
            originalDimensions: { width: img.naturalWidth, height: img.naturalHeight },
            finalDimensions: { width: img.naturalWidth, height: img.naturalHeight },
            message: `Imagem comprimida de ${(file.size / 1024 / 1024).toFixed(2)}MB para ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`
          });
        }, "image/jpeg", quality);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Não foi possível carregar a imagem para compressão"));
      };
      img.src = url;
    });
  }
  /**
   * Batch process multiple images
   */
  async processBatch(files, context = "blog", options = {}) {
    const results = [];
    const errors = [];
    for (let i = 0; i < files.length; i++) {
      try {
        const result = await this.processImage(files[i], context, options);
        results.push(result);
      } catch (error) {
        errors.push({
          file: files[i].name,
          error: error.message
        });
      }
    }
    return {
      results,
      errors,
      totalProcessed: results.length,
      totalErrors: errors.length
    };
  }
  /**
   * Generate preview for processed image
   */
  generatePreview(file, maxWidth = 300, maxHeight = 200) {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        const { width, height } = img;
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        canvas.width = width * ratio;
        canvas.height = height * ratio;
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(null);
      };
      img.src = url;
    });
  }
}
const imageUploadProcessor = new ImageUploadProcessor();
const SmartImageUpload = ({
  onUpload,
  context = "blog",
  multiple = false,
  maxFiles = 5,
  className = "",
  showPreview = true
}) => {
  var _a;
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);
  const handleFiles = useCallback(async (selectedFiles) => {
    if (!(selectedFiles == null ? void 0 : selectedFiles.length)) return;
    setProcessing(true);
    const fileArray = Array.from(selectedFiles);
    try {
      const results = await imageUploadProcessor.processBatch(fileArray, context, {
        quality: 0.85,
        maintainAspectRatio: true,
        useAIUpscaling: true
      });
      const processedFiles = await Promise.all(
        results.results.map(async (result) => ({
          id: Date.now() + Math.random(),
          file: result.file,
          processed: result.processed,
          originalDimensions: result.originalDimensions,
          finalDimensions: result.finalDimensions,
          message: result.message,
          preview: await imageUploadProcessor.generatePreview(result.file),
          status: "success"
        }))
      );
      const errorFiles = results.errors.map((error) => ({
        id: Date.now() + Math.random(),
        fileName: error.file,
        error: error.error,
        status: "error"
      }));
      const allFiles = [...processedFiles, ...errorFiles];
      if (multiple) {
        setFiles((prev) => [...prev, ...allFiles].slice(0, maxFiles));
      } else {
        setFiles(allFiles.slice(0, 1));
      }
      if (onUpload && processedFiles.length > 0) {
        onUpload(multiple ? processedFiles : processedFiles[0]);
      }
    } catch (error) {
      console.error("Erro no processamento de imagens:", error);
      setFiles((prev) => [...prev, {
        id: Date.now(),
        fileName: "Erro geral",
        error: error.message,
        status: "error"
      }]);
    } finally {
      setProcessing(false);
    }
  }, [context, multiple, maxFiles, onUpload]);
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragActive(true);
  }, []);
  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragActive(false);
  }, []);
  const handleInputChange = useCallback((e) => {
    handleFiles(e.target.files);
  }, [handleFiles]);
  const removeFile = useCallback((id) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
  }, []);
  const openFileDialog = useCallback(() => {
    var _a2;
    (_a2 = fileInputRef.current) == null ? void 0 : _a2.click();
  }, []);
  const showPreviewModal = useCallback((file) => {
    setPreviewImage(file);
  }, []);
  const getContextInfo = () => {
    const info = {
      blog: { minWidth: 800, minHeight: 600, description: "Blog articles" },
      card: { minWidth: 600, minHeight: 400, description: "Card images" },
      hero: { minWidth: 1200, minHeight: 800, description: "Hero banners" },
      thumbnail: { minWidth: 300, minHeight: 200, description: "Thumbnails" }
    };
    return info[context] || info.blog;
  };
  const contextInfo = getContextInfo();
  return /* @__PURE__ */ jsxs("div", { className: `smart-image-upload ${className}`, children: [
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: `
          relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
          ${dragActive ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20" : "border-zinc-300 dark:border-zinc-600 hover:border-zinc-400 dark:hover:border-zinc-500"}
          ${processing ? "opacity-50 pointer-events-none" : "cursor-pointer"}
        `,
        onDrop: handleDrop,
        onDragOver: handleDragOver,
        onDragLeave: handleDragLeave,
        onClick: openFileDialog,
        children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              ref: fileInputRef,
              type: "file",
              accept: "image/*",
              multiple,
              onChange: handleInputChange,
              className: "hidden"
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-4", children: [
            /* @__PURE__ */ jsx("div", { className: `
            p-3 rounded-full transition-colors
            ${dragActive ? "bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-400" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"}
          `, children: /* @__PURE__ */ jsx(Upload, { size: 24 }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2", children: "Upload de Imagens Inteligente" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-600 dark:text-zinc-400 mb-2", children: "Arraste e solte ou clique para selecionar imagens" }),
              /* @__PURE__ */ jsxs("p", { className: "text-xs text-zinc-500 dark:text-zinc-500", children: [
                "Contexto: ",
                contextInfo.description,
                " • Mínimo: ",
                contextInfo.minWidth,
                "x",
                contextInfo.minHeight,
                "px"
              ] })
            ] }),
            processing && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-blue-600 dark:text-blue-400", children: [
              /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm", children: "Processando imagens..." })
            ] })
          ] })
        ]
      }
    ),
    files.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-6 space-y-3", children: [
      /* @__PURE__ */ jsxs("h4", { className: "font-semibold text-zinc-900 dark:text-zinc-100", children: [
        "Imagens Processadas (",
        files.length,
        ")"
      ] }),
      files.map((file) => {
        var _a2;
        return /* @__PURE__ */ jsxs(
          "div",
          {
            className: `
                flex items-center gap-4 p-4 rounded-lg border
                ${file.status === "success" ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800" : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"}
              `,
            children: [
              /* @__PURE__ */ jsx("div", { className: `
                flex-shrink-0 p-2 rounded-full
                ${file.status === "success" ? "bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-400" : "bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-400"}
              `, children: file.status === "success" ? /* @__PURE__ */ jsx(CheckCircle, { size: 20 }) : /* @__PURE__ */ jsx(WarningCircle, { size: 20 }) }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsx("p", { className: "font-medium text-zinc-900 dark:text-zinc-100 truncate", children: ((_a2 = file.file) == null ? void 0 : _a2.name) || file.fileName }),
                file.status === "success" ? /* @__PURE__ */ jsxs("div", { className: "text-sm text-zinc-600 dark:text-zinc-400", children: [
                  /* @__PURE__ */ jsx("p", { children: file.message }),
                  file.originalDimensions && file.finalDimensions && /* @__PURE__ */ jsx("p", { className: "text-xs mt-1", children: file.processed ? `${file.originalDimensions.width}x${file.originalDimensions.height} → ${Math.round(file.finalDimensions.width)}x${Math.round(file.finalDimensions.height)}` : `${file.originalDimensions.width}x${file.originalDimensions.height} (original)` })
                ] }) : /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600 dark:text-red-400", children: file.error })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                file.status === "success" && file.preview && showPreview && /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => showPreviewModal(file),
                    className: "p-2 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors",
                    title: "Visualizar",
                    children: /* @__PURE__ */ jsx(Eye, { size: 16 })
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => removeFile(file.id),
                    className: "p-2 text-zinc-500 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400 transition-colors",
                    title: "Remover",
                    children: /* @__PURE__ */ jsx(X, { size: 16 })
                  }
                )
              ] })
            ]
          },
          file.id
        );
      })
    ] }),
    previewImage && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-zinc-900 rounded-lg max-w-2xl max-h-[90vh] overflow-hidden", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-700", children: [
        /* @__PURE__ */ jsxs("h3", { className: "font-semibold text-zinc-900 dark:text-zinc-100", children: [
          "Preview - ",
          (_a = previewImage.file) == null ? void 0 : _a.name
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setPreviewImage(null),
            className: "p-2 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200",
            children: /* @__PURE__ */ jsx(X, { size: 20 })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "p-4", children: [
        /* @__PURE__ */ jsx(
          "img",
          {
            src: previewImage.preview,
            alt: "Preview",
            className: "max-w-full max-h-96 mx-auto rounded-lg"
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "mt-4 text-sm text-zinc-600 dark:text-zinc-400", children: [
          /* @__PURE__ */ jsxs("p", { children: [
            /* @__PURE__ */ jsx("strong", { children: "Dimensões:" }),
            " ",
            Math.round(previewImage.finalDimensions.width),
            "x",
            Math.round(previewImage.finalDimensions.height)
          ] }),
          /* @__PURE__ */ jsxs("p", { children: [
            /* @__PURE__ */ jsx("strong", { children: "Processado:" }),
            " ",
            previewImage.processed ? "Sim" : "Não"
          ] }),
          /* @__PURE__ */ jsxs("p", { children: [
            /* @__PURE__ */ jsx("strong", { children: "Status:" }),
            " ",
            previewImage.message
          ] })
        ] })
      ] })
    ] }) })
  ] });
};
export {
  SmartImageUpload as default
};
