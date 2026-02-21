import React, { useEffect, useState } from 'react'
import SummaryApi from '../common'
import { toast } from 'react-toastify'
import moment from 'moment'
import { MdModeEdit } from "react-icons/md"
import ChangeUserRole from '../components/ChangeUserRole'
import { useSelector } from 'react-redux'

const AllUsers = () => {
    const [allUser, setAllUsers] = useState([])
    const [openUpdateRole, setOpenUpdateRole] = useState(false)
    const [updateUserDetails, setUpdateUserDetails] = useState({
        email: "", name: "", role: "", _id: ""
    })
    const currentUser = useSelector(state => state?.user?.user)

    const fetchAllUsers = async () => {
        const fetchData = await fetch(SummaryApi.allUser.url, {
            method: SummaryApi.allUser.method,
            credentials: 'include'
        })
        const dataResponse = await fetchData.json()
        if (dataResponse.success) setAllUsers(dataResponse.data)
        if (dataResponse.error) toast.error(dataResponse.message)
    }

    useEffect(() => { fetchAllUsers() }, [])

    return (
        <div style={{ padding: '24px' }}>

            {/* Header */}
            <div style={{ marginBottom: '28px' }}>
                <h2 style={{
                    fontSize: '24px', fontWeight: 800, margin: '0 0 6px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                }}>
                    All Users
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', margin: 0 }}>
                    {allUser.length} total users registered
                </p>
            </div>

            {/* User Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {allUser.length === 0 ? (
                    <div style={{
                        textAlign: 'center', padding: '60px',
                        color: 'rgba(255,255,255,0.3)',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '20px',
                        border: '1px solid rgba(255,255,255,0.08)'
                    }}>
                        <p style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>No users found</p>
                    </div>
                ) : (
                    allUser.map((el, index) => (
                        <div
                            key={el._id}
                            style={{
                                background: 'rgba(255,255,255,0.05)',
                                borderRadius: '16px',
                                border: '1px solid rgba(255,255,255,0.08)',
                                padding: '18px 22px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = 'rgba(102,126,234,0.08)'
                                e.currentTarget.style.borderColor = 'rgba(102,126,234,0.3)'
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                            }}
                        >
                            {/* Index */}
                            <span style={{
                                color: 'rgba(255,255,255,0.25)',
                                fontSize: '13px', fontWeight: 600,
                                minWidth: '24px', textAlign: 'center'
                            }}>
                                {index + 1}
                            </span>

                            {/* Avatar */}
                            <div style={{
                                width: '46px', height: '46px', borderRadius: '50%', flexShrink: 0,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '18px', fontWeight: 800, color: '#fff',
                                boxShadow: '0 4px 12px rgba(102,126,234,0.3)'
                            }}>
                                {el?.name?.charAt(0)?.toUpperCase()}
                            </div>

                            {/* Name + Email */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{
                                    color: '#fff', fontWeight: 700, fontSize: '15px',
                                    margin: '0 0 4px',
                                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                                }}>
                                    {el?.name}
                                </p>
                                <p style={{
                                    color: 'rgba(255,255,255,0.45)', fontSize: '13px', margin: 0,
                                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                                }}>
                                    {el?.email}
                                </p>
                            </div>

                            {/* Role Badge */}
                            <span style={{
                                padding: '5px 14px', borderRadius: '20px',
                                fontSize: '11px', fontWeight: 700,
                                background: el?.role === 'ADMIN'
                                    ? 'rgba(245,87,108,0.15)' : 'rgba(102,126,234,0.15)',
                                color: el?.role === 'ADMIN' ? '#f5576c' : '#667eea',
                                border: el?.role === 'ADMIN'
                                    ? '1px solid rgba(245,87,108,0.3)' : '1px solid rgba(102,126,234,0.3)',
                                textTransform: 'uppercase', letterSpacing: '0.8px',
                                flexShrink: 0
                            }}>
                                {el?.role}
                            </span>

                            {/* Date */}
                            <p style={{
                                color: 'rgba(255,255,255,0.35)', fontSize: '12px',
                                margin: 0, flexShrink: 0, minWidth: '100px', textAlign: 'right'
                            }}>
                                {moment(el?.createdAt).format('MMM D, YYYY')}
                            </p>

                            {/* Edit Button — hidden for logged-in admin's own account */}
                            {currentUser?._id === el?._id ? (
                                <span style={{
                                    padding: '8px 16px', borderRadius: '10px',
                                    fontSize: '12px', fontWeight: 600,
                                    color: 'rgba(255,255,255,0.2)',
                                    background: 'rgba(255,255,255,0.04)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    flexShrink: 0
                                }}>
                                    You
                                </span>
                            ) : (
                                <button
                                    onClick={() => { setUpdateUserDetails(el); setOpenUpdateRole(true) }}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '6px',
                                        padding: '8px 16px', borderRadius: '10px',
                                        border: 'none', cursor: 'pointer', fontSize: '13px',
                                        fontWeight: 600, flexShrink: 0,
                                        background: 'rgba(102,126,234,0.15)', color: '#667eea',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.background = 'linear-gradient(135deg, #667eea, #764ba2)'
                                        e.currentTarget.style.color = '#fff'
                                        e.currentTarget.style.boxShadow = '0 4px 14px rgba(102,126,234,0.4)'
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.background = 'rgba(102,126,234,0.15)'
                                        e.currentTarget.style.color = '#667eea'
                                        e.currentTarget.style.boxShadow = 'none'
                                    }}
                                >
                                    <MdModeEdit style={{ fontSize: '15px' }} />
                                    Edit Role
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>

            {openUpdateRole && (
                <ChangeUserRole
                    onClose={() => setOpenUpdateRole(false)}
                    name={updateUserDetails.name}
                    email={updateUserDetails.email}
                    role={updateUserDetails.role}
                    userId={updateUserDetails._id}
                    callFunc={fetchAllUsers}
                />
            )}
        </div>
    )
}

export default AllUsers