const backendDomain = "http://localhost:8080"

const uploadImage = async (image) => {
    const formData = new FormData()
    formData.append('productImage', image)

    const response = await fetch(`${backendDomain}/api/upload-image`, {
        method: 'POST',
        credentials: 'include',
        body: formData   
    })

    const result = await response.json()
    return result 
}

export default uploadImage