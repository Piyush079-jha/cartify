

const addToWishlist = async(e, id) => {
    e?.stopPropagation()
    e?.preventDefault()

    const response = await fetch(process.env.REACT_APP_BACKEND_URL + "/api/addtowishlist", {
        method: "post",
        credentials: 'include',
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            productId: id
        })
    })

    const responseData = await response.json()
    return responseData
}

export default addToWishlist