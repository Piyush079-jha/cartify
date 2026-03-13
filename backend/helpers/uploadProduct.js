const uploadImage = async (image) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onloadend = () => {
            resolve({ url: reader.result })  // reader.result is the base64 string
        }

        reader.onerror = () => {
            reject(new Error("Failed to read image file"))
        }

        reader.readAsDataURL(image)  
    })
}

export default uploadImage
