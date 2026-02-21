import React, { useState } from 'react'
import ROLE from '../common/role'
import { IoMdClose } from "react-icons/io"
import SummaryApi from '../common'
import { toast } from 'react-toastify'

const ChangeUserRole = ({ name, email, role, userId, onClose, callFunc }) => {
    const [userRole, setUserRole] = useState(role)

    const updateUserRole = async () => {
        const fetchResponse = await fetch(SummaryApi.updateUser.url, {
            method: SummaryApi.updateUser.method,
            credentials: 'include',
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ userId, role: userRole })
        })
        const responseData = await fetchResponse.json()
        if (responseData.success) {
            toast.success(responseData.message)
            onClose()
            callFunc()
        } else {
            toast.error(responseData.message)
        }
    }

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(10,10,30,0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px'
        }}>
            <div style={{
                background: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)',
                borderRadius: '24px',
                width: '100%',
                maxWidth: '420px',
                boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
                border: '1px solid rgba(255,255,255,0.1)',
                overflow: 'hidden'
            }}>
                {/* Header */}
                <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '22px 26px',
                    borderBottom: '1px solid rgba(255,255,255,0.08)'
                }}>
                    <div>
                        <h2 style={{ color: '#fff', fontWeight: 800, fontSize: '18px', margin: 0 }}>
                            Change User Role
                        </h2>
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', margin: '3px 0 0' }}>
                            Update permissions for this user
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'rgba(255,255,255,0.08)', border: 'none',
                            borderRadius: '10px', color: 'rgba(255,255,255,0.7)',
                            fontSize: '18px', cursor: 'pointer',
                            width: '36px', height: '36px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245,87,108,0.25)'; e.currentTarget.style.color = '#f5576c' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)' }}
                    >
                        <IoMdClose />
                    </button>
                </div>

                {/* Body */}
                <div style={{ padding: '26px' }}>

                    {/* User Info Card */}
                    <div style={{
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '14px',
                        padding: '16px',
                        border: '1px solid rgba(255,255,255,0.08)',
                        marginBottom: '22px',
                        display: 'flex', alignItems: 'center', gap: '14px'
                    }}>
                        <div style={{
                            width: '46px', height: '46px', borderRadius: '50%', flexShrink: 0,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '18px', fontWeight: 800, color: '#fff'
                        }}>
                            {name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                            <p style={{ color: '#fff', fontWeight: 700, fontSize: '15px', margin: '0 0 3px' }}>{name}</p>
                            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '12px', margin: 0 }}>{email}</p>
                        </div>
                    </div>

                    {/* Role Selector */}
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{
                            fontSize: '11px', fontWeight: 700, letterSpacing: '1px',
                            textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)',
                            display: 'block', marginBottom: '8px'
                        }}>
                            Select Role
                        </label>
                        <select
                            value={userRole}
                            onChange={e => setUserRole(e.target.value)}
                            style={{
                                width: '100%', padding: '11px 14px',
                                background: 'rgba(255,255,255,0.07)',
                                border: '1px solid rgba(255,255,255,0.13)',
                                borderRadius: '10px', color: '#fff',
                                fontSize: '14px', outline: 'none', cursor: 'pointer'
                            }}
                            onFocus={e => e.target.style.border = '1px solid #667eea'}
                            onBlur={e => e.target.style.border = '1px solid rgba(255,255,255,0.13)'}
                        >
                            {Object.values(ROLE).map(el => (
                                <option key={el} value={el} style={{ background: '#1a1a2e' }}>{el}</option>
                            ))}
                        </select>
                    </div>

                    {/* Buttons */}
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            onClick={onClose}
                            style={{
                                flex: 1, padding: '12px',
                                background: 'rgba(255,255,255,0.07)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '12px', color: 'rgba(255,255,255,0.7)',
                                fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={updateUserRole}
                            style={{
                                flex: 1, padding: '12px',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                border: 'none', borderRadius: '12px',
                                color: '#fff', fontSize: '14px', fontWeight: 700,
                                cursor: 'pointer', transition: 'all 0.2s',
                                boxShadow: '0 4px 16px rgba(102,126,234,0.35)'
                            }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(102,126,234,0.45)' }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(102,126,234,0.35)' }}
                        >
                            Update Role
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChangeUserRole