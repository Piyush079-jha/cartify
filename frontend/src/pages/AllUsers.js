import React, { useEffect, useState } from 'react'
import SummaryApi from '../common'
import { toast } from 'react-toastify'
import moment from 'moment'
import { MdModeEdit } from 'react-icons/md'
import ChangeUserRole from '../components/ChangeUserRole'
import { useSelector } from 'react-redux'
import { FaRegCircleUser } from 'react-icons/fa6'

const AllUsers = () => {
  const [allUser, setAllUsers]           = useState([])
  const [openUpdateRole, setOpenUpdateRole] = useState(false)
  const [updateUserDetails, setUpdateUserDetails] = useState({ email: '', name: '', role: '', _id: '' })
  const currentUser = useSelector(state => state?.user?.user)

  const gold       = '#c9a84c'
  const border     = 'rgba(255,255,255,0.07)'
  const muted      = 'rgba(160,152,144,0.7)'
  const text       = '#e8e4dc'
  const surface    = '#161616'
  const goldBg     = 'rgba(201,168,76,0.07)'
  const goldBorder = 'rgba(201,168,76,0.22)'

  const fetchAllUsers = async () => {
    const fetchData = await fetch(SummaryApi.allUser.url, {
      method: SummaryApi.allUser.method,
      credentials: 'include'
    })
    const dataResponse = await fetchData.json()
    if (dataResponse.success) setAllUsers(dataResponse.data)
    if (dataResponse.error)   toast.error(dataResponse.message)
  }

  useEffect(() => { fetchAllUsers() }, [])

  return (
    <>
      <style>{`
        @keyframes auFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .au-row {
          background: ${surface};
          border: 0.5px solid ${border};
          padding: 14px 18px;
          display: flex; align-items: center; gap: 14px;
          transition: border-color 0.18s ease, background 0.18s ease;
          animation: auFadeIn 0.3s ease both;
        }
        .au-row:hover {
          border-color: ${goldBorder};
          background: #1a1a18;
        }
        .au-edit-btn {
          display: flex; align-items: center; gap: 5px;
          padding: 6px 12px;
          background: transparent;
          border: 0.5px solid ${border};
          color: ${muted};
          font-size: 10px; font-weight: 400;
          letter-spacing: 0.1em; text-transform: uppercase;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s ease;
          flex-shrink: 0; border-radius: 1px;
        }
        .au-edit-btn:hover {
          border-color: ${gold};
          color: ${gold};
          background: ${goldBg};
        }
        @media (max-width: 640px) {
          .au-date  { display: none !important; }
          .au-email { display: none !important; }
          .au-row   { padding: 12px 14px !important; }
        }
      `}</style>

      <div style={{ animation: 'auFadeIn 0.35s ease' }}>

        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
          marginBottom: '24px', paddingBottom: '18px',
          borderBottom: `0.5px solid ${border}`
        }}>
          <div>
            <p style={{
              fontSize: '9px', fontWeight: 400, letterSpacing: '0.18em',
              textTransform: 'uppercase', color: gold,
              margin: '0 0 6px', fontFamily: 'DM Sans, sans-serif'
            }}>
              Admin
            </p>
            <h2 style={{
              fontFamily: 'Cormorant Garamond, Georgia, serif',
              fontSize: '28px', fontWeight: 300,
              color: text, margin: 0, letterSpacing: '-0.01em', lineHeight: 1
            }}>
              All Users
            </h2>
            <p style={{
              fontSize: '11px', color: muted, margin: '6px 0 0',
              fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.04em'
            }}>
              {allUser.length} registered users
            </p>
          </div>

          {/* Count badge */}
          <div style={{
            border: `0.5px solid ${border}`,
            background: 'rgba(255,255,255,0.02)',
            padding: '14px 20px', textAlign: 'center'
          }}>
            <p style={{
              fontFamily: 'Cormorant Garamond, Georgia, serif',
              fontSize: '28px', fontWeight: 300,
              color: gold, margin: 0, lineHeight: 1, letterSpacing: '-0.02em'
            }}>
              {allUser.length}
            </p>
            <p style={{
              fontSize: '8.5px', letterSpacing: '0.14em', textTransform: 'uppercase',
              color: muted, margin: '4px 0 0', fontFamily: 'DM Sans, sans-serif'
            }}>
              Users
            </p>
          </div>
        </div>

        {/* Column headers */}
        {allUser.length > 0 && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '14px',
            padding: '8px 18px',
            marginBottom: '1px',
            background: 'rgba(255,255,255,0.02)',
            border: `0.5px solid ${border}`
          }}>
            <span style={{ width: '20px', flexShrink: 0 }} />
            <span style={{ width: '40px', flexShrink: 0 }} />
            <span style={{
              flex: 1, fontSize: '8.5px', letterSpacing: '0.14em',
              textTransform: 'uppercase', color: muted,
              fontFamily: 'DM Sans, sans-serif'
            }}>
              Name
            </span>
            <span className="au-email" style={{
              width: '200px', fontSize: '8.5px', letterSpacing: '0.14em',
              textTransform: 'uppercase', color: muted,
              fontFamily: 'DM Sans, sans-serif', flexShrink: 0
            }}>
              Email
            </span>
            <span style={{
              width: '72px', fontSize: '8.5px', letterSpacing: '0.14em',
              textTransform: 'uppercase', color: muted,
              fontFamily: 'DM Sans, sans-serif', textAlign: 'center', flexShrink: 0
            }}>
              Role
            </span>
            <span className="au-date" style={{
              width: '90px', fontSize: '8.5px', letterSpacing: '0.14em',
              textTransform: 'uppercase', color: muted,
              fontFamily: 'DM Sans, sans-serif', textAlign: 'right', flexShrink: 0
            }}>
              Joined
            </span>
            <span style={{ width: '80px', flexShrink: 0 }} />
          </div>
        )}

        {/* User rows */}
        {allUser.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '80px 20px',
            border: `0.5px solid ${border}`,
            background: 'rgba(255,255,255,0.01)'
          }}>
            <FaRegCircleUser style={{ fontSize: '28px', color: 'rgba(201,168,76,0.15)', marginBottom: '14px' }} />
            <p style={{
              fontFamily: 'Cormorant Garamond, Georgia, serif',
              fontSize: '22px', fontWeight: 300, color: text, margin: '0 0 6px'
            }}>
              No users found
            </p>
            <p style={{ fontSize: '12px', color: muted, margin: 0, letterSpacing: '0.04em', fontFamily: 'DM Sans, sans-serif' }}>
              Users will appear here once registered
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
            {allUser.map((el, index) => {
              const isAdmin   = el?.role === 'ADMIN'
              const isCurrentUser = currentUser?._id === el?._id

              return (
                <div
                  key={el._id}
                  className="au-row"
                  style={{ animationDelay: `${index * 0.04}s` }}
                >
                  {/* Index */}
                  <span style={{
                    width: '20px', flexShrink: 0,
                    fontSize: '10px', color: 'rgba(255,255,255,0.18)',
                    fontFamily: 'DM Sans, sans-serif', textAlign: 'center'
                  }}>
                    {index + 1}
                  </span>

                  {/* Avatar */}
                  <div style={{
                    width: '36px', height: '36px',
                    border: `0.5px solid ${isAdmin ? goldBorder : border}`,
                    background: isAdmin ? goldBg : 'rgba(255,255,255,0.03)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '14px', fontWeight: 500,
                    color: isAdmin ? gold : muted,
                    flexShrink: 0, overflow: 'hidden',
                    fontFamily: 'DM Sans, sans-serif'
                  }}>
                    {el?.profilePic
                      ? <img src={el.profilePic} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                      : el?.name?.charAt(0)?.toUpperCase()
                    }
                  </div>

                  {/* Name */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      color: text, fontSize: '13px', fontWeight: 400,
                      margin: 0, letterSpacing: '0.01em',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      fontFamily: 'DM Sans, sans-serif'
                    }}>
                      {el?.name}
                      {isCurrentUser && (
                        <span style={{
                          marginLeft: '8px', fontSize: '9px',
                          color: gold, letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          fontFamily: 'DM Sans, sans-serif'
                        }}>
                          You
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Email */}
                  <p className="au-email" style={{
                    width: '200px', flexShrink: 0,
                    color: muted, fontSize: '12px', margin: 0,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    letterSpacing: '0.02em', fontFamily: 'DM Sans, sans-serif'
                  }}>
                    {el?.email}
                  </p>

                  {/* Role badge */}
                  <span style={{
                    width: '72px', flexShrink: 0, textAlign: 'center',
                    display: 'inline-block',
                    padding: '3px 0',
                    border: `0.5px solid ${isAdmin ? goldBorder : border}`,
                    background: isAdmin ? goldBg : 'transparent',
                    color: isAdmin ? gold : muted,
                    fontSize: '8.5px', fontWeight: 500,
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    fontFamily: 'DM Sans, sans-serif'
                  }}>
                    {el?.role}
                  </span>

                  {/* Date */}
                  <p className="au-date" style={{
                    width: '90px', flexShrink: 0,
                    color: 'rgba(160,152,144,0.5)', fontSize: '11px',
                    margin: 0, textAlign: 'right',
                    letterSpacing: '0.02em', fontFamily: 'DM Sans, sans-serif'
                  }}>
                    {moment(el?.createdAt).format('MMM D, YYYY')}
                  </p>

                  {/* Edit / You */}
                  <div style={{ width: '80px', flexShrink: 0, display: 'flex', justifyContent: 'flex-end' }}>
                    {isCurrentUser ? (
                      <span style={{
                        padding: '6px 12px',
                        border: `0.5px solid ${border}`,
                        color: 'rgba(255,255,255,0.15)',
                        fontSize: '10px', letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        fontFamily: 'DM Sans, sans-serif'
                      }}>
                        You
                      </span>
                    ) : (
                      <button
                        className="au-edit-btn"
                        onClick={() => { setUpdateUserDetails(el); setOpenUpdateRole(true) }}
                      >
                        <MdModeEdit style={{ fontSize: '12px' }} />
                        Edit
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
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
    </>
  )
}

export default AllUsers