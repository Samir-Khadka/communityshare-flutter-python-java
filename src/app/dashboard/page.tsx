'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Search, MapPin, Star, Calendar, MessageCircle, Plus, Wrench, Home as HomeIcon, User as UserIcon, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function DashboardPage() {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [user, setUser] = useState<any>(null)
    const [isAdmin, setIsAdmin] = useState(false)
    const [allUsers, setAllUsers] = useState<any[]>([])
    const [activeSection, setActiveSection] = useState('home')
    const [items, setItems] = useState([
        {
            id: '1',
            title: 'Power Drill Set',
            description: 'Complete cordless drill set with various bits and batteries',
            category: 'Power Tools',
            owner: 'John Doe',
            location: 'London, SW1A',
            rating: 4.8,
            image: 'https://images.unsplash.com/photo-1540348563548-6485ec92671e?auto=format&fit=crop&w=800&q=80',
            available: true
        },
        {
            id: '2',
            title: 'Garden Lawnmower',
            description: 'Electric lawnmower, perfect for small to medium gardens',
            category: 'Gardening',
            owner: 'Jane Smith',
            location: 'London, E1 6AN',
            rating: 4.5,
            image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80',
            available: true
        },
        {
            id: '3',
            title: 'Extension Ladder',
            description: 'Aluminum extension ladder, extends to 20 feet',
            category: 'Equipment',
            owner: 'Mike Johnson',
            location: 'London, N1C 4AG',
            rating: 4.9,
            image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
            available: false
        }
    ])

    // Profile State (moved to top level to follow Rules of Hooks)
    const [isEditingProfile, setIsEditingProfile] = useState(false)
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        phone: '',
        location: '',
        bio: ''
    })
    const [profilePicture, setProfilePicture] = useState('https://placehold.co/80x80')

    // Admin Edit Item Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [itemToEdit, setItemToEdit] = useState<any>(null)
    const [isAdjustTokenModalOpen, setIsAdjustTokenModalOpen] = useState(false)
    const [userToAdjust, setUserToAdjust] = useState<any>(null)
    const [tokenAdjustment, setTokenAdjustment] = useState({ amount: 10, type: 'ADMIN_ADJUSTMENT', reason: '' })

    const categories = ['all', 'Power Tools', 'Gardening', 'Kitchen', 'Equipment', 'Cleaning']

    useEffect(() => {
        // Check authentication
        const authToken = localStorage.getItem('authToken')
        const userData = localStorage.getItem('user')
        const storedUser = localStorage.getItem('user')

        if (!authToken || !storedUser) {
            router.push('/login')
            return
        }

        const parsedUserData = JSON.parse(storedUser)
        setUser(parsedUserData)
        setIsAdmin(parsedUserData.role === 'admin')

        // Re-verify role from backend just in case
        const reVerifyRole = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/v1/users/${parsedUserData.uid}`)
                if (response.ok) {
                    const latestUser = await response.json()
                    if (latestUser.role !== parsedUserData.role) {
                        const updatedUser = { ...parsedUserData, role: latestUser.role }
                        localStorage.setItem('user', JSON.stringify(updatedUser))
                        setUser(updatedUser)
                        setIsAdmin(latestUser.role === 'admin')
                    }
                }
            } catch (err) {
                console.error('Failed to re-verify role:', err)
            }
        }
        reVerifyRole()
        setProfileData({
            name: parsedUserData.name || '',
            email: parsedUserData.email || '',
            phone: '',
            location: '',
            bio: ''
        })

        // Fetch live items from Python backend
        fetchItems()
    }, [router])

    const fetchItems = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/v1/items')
            if (response.ok) {
                const data = await response.json()
                if (data) {
                    const formattedItems = data.map((item: any) => ({
                        id: item.id,
                        title: item.title,
                        description: item.description,
                        category: item.category,
                        owner: item.ownerId,
                        location: 'London, UK',
                        rating: 4.5,
                        image: item.imageUrl || 'https://images.unsplash.com/photo-1540103359371-30d075bc7bde?auto=format&fit=crop&w=800&q=80',
                        available: item.isAvailable ?? true
                    }))
                    setItems(formattedItems)
                }
            }
        } catch (error) {
            console.error('Error fetching items:', error)
            // If fetch fails, keep mock items but show warning in console
        }
    }

    const fetchUsers = async () => {
        try {
            console.log('Fetching users from backend...')
            const response = await fetch('http://localhost:8000/api/v1/users')
            if (response.ok) {
                const data = await response.json()
                console.log('Successfully fetched users:', data?.length)
                setAllUsers(data || [])
            } else {
                console.error('Failed to fetch users:', response.status, response.statusText)
            }
        } catch (error) {
            console.error('Error fetching users:', error)
        }
    }

    useEffect(() => {
        if (activeSection === 'admin') {
            fetchUsers()
            fetchItems()
        }
    }, [activeSection])

    const handleLogout = () => {
        localStorage.removeItem('authToken')
        localStorage.removeItem('user')
        router.push('/')
    }

    const filteredItems = items.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
        return matchesSearch && matchesCategory
    })

    if (!user) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>
    }

    // Render different sections based on activeSection
    const handleDeleteItem = async (itemId: string, isAdminRemoval = false) => {
        if (!confirm(`Are you sure you want to ${isAdminRemoval ? 'REOVE and PENALIZE' : 'delete'} this item?`)) return
        try {
            const url = `http://localhost:8000/api/v1/items/${itemId}${isAdminRemoval ? '?admin_removal=true' : ''}`
            const response = await fetch(url, { method: 'DELETE' })
            if (response.ok) {
                fetchItems()
                if (isAdminRemoval) {
                    alert('Item removed and owner penalized 20 tokens.')
                    fetchUsers() // Refresh user token balances if shown
                }
            }
        } catch (error) {
            console.error('Error deleting item:', error)
        }
    }

    const handleUpdateItem = async (itemId: string, updates: any) => {
        try {
            const response = await fetch(`http://localhost:8000/api/v1/items/${itemId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            })
            if (response.ok) {
                setIsEditModalOpen(false)
                fetchItems()
            }
        } catch (error) {
            console.error('Error updating item:', error)
        }
    }

    const handleAdjustTokens = async (userId: string) => {
        try {
            const response = await fetch(`http://localhost:8000/api/v1/users/${userId}/adjust-tokens`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: tokenAdjustment.amount,
                    transactionType: tokenAdjustment.type,
                    description: tokenAdjustment.reason || 'Manual admin adjustment'
                })
            })
            if (response.ok) {
                setIsAdjustTokenModalOpen(false)
                fetchUsers()
                alert('Tokens adjusted successfully!')
            }
        } catch (error) {
            console.error('Error adjusting tokens:', error)
        }
    }

    const handleUpdateUserRole = async (userId: string, newRole: string) => {
        try {
            const response = await fetch(`http://localhost:8000/api/v1/users/${userId}/role?role=${newRole}`, { method: 'PATCH' })
            if (response.ok) {
                fetchUsers()
            }
        } catch (error) {
            console.error('Error updating user role:', error)
        }
    }

    const handleDeleteUser = async (userId: string, userName: string) => {
        if (!confirm(`Are you sure you want to PERMANENTLY DELETE user "${userName}"? This will remove all their data from Firestore.`)) return
        try {
            const response = await fetch(`http://localhost:8000/api/v1/users/${userId}`, { method: 'DELETE' })
            if (response.ok) {
                alert('User deleted successfully.')
                fetchUsers()
            } else {
                alert('Failed to delete user.')
            }
        } catch (error) {
            console.error('Error deleting user:', error)
        }
    }

    // Render different sections based on activeSection
    const renderAdminSection = () => (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold">Admin Dashboard</h2>
                <div className="flex space-x-4">
                    <Badge variant="outline" className="text-lg py-2 px-4 shadow-sm">
                        <UserIcon className="h-5 w-5 mr-2 text-blue-500" />
                        {allUsers.length} Total Users
                    </Badge>
                    <Badge variant="outline" className="text-lg py-2 px-4 shadow-sm">
                        <Wrench className="h-5 w-5 mr-2 text-green-500" />
                        {items.length} Total Tools
                    </Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* User Management */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <UserIcon className="h-5 w-5 text-blue-500" />
                            <span>User Management</span>
                        </CardTitle>
                        <CardDescription>Manage community members and roles</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {allUsers.map((u) => (
                                <div key={u.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={u.photoUrl} />
                                            <AvatarFallback>{u.displayName?.[0]}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium text-sm">{u.displayName}</p>
                                            <p className="text-xs text-gray-500">{u.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="text-right mr-2">
                                            <p className="text-xs font-bold text-yellow-600">{u.tokens || 0} Tokens</p>
                                        </div>
                                        <Badge variant={u.role === 'admin' ? 'default' : 'outline'}>
                                            {u.role || 'user'}
                                        </Badge>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => {
                                                setUserToAdjust(u)
                                                setIsAdjustTokenModalOpen(true)
                                            }}
                                        >
                                            Adjust
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleUpdateUserRole(u.id, u.role === 'admin' ? 'user' : 'admin')}
                                        >
                                            Toggle Role
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                            onClick={() => handleDeleteUser(u.id, u.displayName)}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Tool Management */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Wrench className="h-5 w-5 text-green-500" />
                            <span>Global Tool List</span>
                        </CardTitle>
                        <CardDescription>Monitor and moderate listed tools</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {items.map((it) => (
                                <div key={it.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="relative w-10 h-10 rounded overflow-hidden">
                                            <Image src={it.image} alt={it.title} fill className="object-cover" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{it.title}</p>
                                            <p className="text-xs text-gray-500 capitalize">{it.category}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="text-blue-500 hover:text-blue-700"
                                            onClick={() => {
                                                setItemToEdit(it)
                                                setIsEditModalOpen(true)
                                            }}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="text-red-500 hover:text-red-700"
                                            onClick={() => handleDeleteItem(it.id, true)}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )

    const renderContent = () => {
        switch (activeSection) {
            case 'browse':
                return renderBrowseSection()
            case 'messages':
                return renderMessagesSection()
            case 'profile':
                return renderProfileSection()
            case 'admin':
                return renderAdminSection()
            case 'list-item':
                return renderListItemSection()
            default:
                return renderHomeSection()
        }
    }

    const renderHomeSection = () => (
        <>
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Welcome back, {user.name || 'User'}!
                    </h1>
                    <p className="text-xl mb-8 max-w-3xl mx-auto">
                        Ready to share tools or find what you need? Browse available items or list your own.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100" onClick={() => setActiveSection('browse')}>
                            Browse Tools
                        </Button>
                        <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600" onClick={() => setActiveSection('list-item')}>
                            List Your Tools
                        </Button>
                    </div>
                </div>
            </section>

            {/* Quick Stats */}
            <section className="py-8 bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-2xl">5</CardTitle>
                                <CardDescription>Your Tokens</CardDescription>
                            </CardHeader>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-2xl">3</CardTitle>
                                <CardDescription>Items Listed</CardDescription>
                            </CardHeader>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-2xl">12</CardTitle>
                                <CardDescription>Successful Exchanges</CardDescription>
                            </CardHeader>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Recent Items */}
            <section className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold mb-6">Recently Added</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {items.slice(0, 3).map(item => (
                            <Card key={item.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                                <div className="relative w-full h-48">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className="object-cover transition-transform hover:scale-105 duration-300"
                                    />
                                </div>
                                <CardHeader>
                                    <CardTitle>{item.title}</CardTitle>
                                    <CardDescription>{item.description}</CardDescription>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )

    const renderBrowseSection = () => (
        <>
            {/* Search and Filters */}
            <section className="py-8 bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold mb-6">Browse Tools</h2>
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                placeholder="Search for tools, equipment, or supplies..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            {categories.map(category => (
                                <Button
                                    key={category}
                                    variant={selectedCategory === category ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setSelectedCategory(category)}
                                >
                                    {category}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Items Grid */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Tabs defaultValue="available" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="available">Available Now</TabsTrigger>
                        <TabsTrigger value="nearby">Near Me</TabsTrigger>
                        <TabsTrigger value="popular">Popular</TabsTrigger>
                    </TabsList>

                    <TabsContent value="available" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredItems.map(item => (
                                <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                    <div className="aspect-video bg-gray-200 relative overflow-hidden">
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            fill
                                            className="object-cover transition-transform hover:scale-105 duration-300"
                                        />
                                        {!item.available && (
                                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                                <Badge variant="secondary" className="bg-red-500 text-white">
                                                    Currently Unavailable
                                                </Badge>
                                            </div>
                                        )}
                                    </div>
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <CardTitle className="text-lg">{item.title}</CardTitle>
                                            <Badge variant="outline">{item.category}</Badge>
                                        </div>
                                        <CardDescription className="line-clamp-2">{item.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center space-x-2">
                                                <Avatar className="h-6 w-6">
                                                    <AvatarImage src="https://placehold.co/24x24" alt={item.owner} />
                                                    <AvatarFallback className="text-xs">{item.owner[0]}</AvatarFallback>
                                                </Avatar>
                                                <span className="text-sm text-gray-600">{item.owner}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                                <span className="text-sm font-medium">{item.rating}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-1 text-gray-500">
                                                <MapPin className="h-4 w-4" />
                                                <span className="text-sm">{item.location}</span>
                                            </div>
                                            <Button size="sm" disabled={!item.available}>
                                                {item.available ? 'Request to Borrow' : 'Unavailable'}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="nearby" className="space-y-6">
                        <div className="text-center py-12">
                            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Enable Location Services</h3>
                            <p className="text-gray-600 mb-4">Allow location access to see tools available in your area</p>
                            <Button>Enable Location</Button>
                        </div>
                    </TabsContent>

                    <TabsContent value="popular" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredItems.slice(0, 3).map(item => (
                                <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                    <div className="aspect-video bg-gray-200 relative">
                                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                        <Badge className="absolute top-2 right-2 bg-orange-500">Popular</Badge>
                                    </div>
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <CardTitle className="text-lg">{item.title}</CardTitle>
                                            <Badge variant="outline">{item.category}</Badge>
                                        </div>
                                        <CardDescription className="line-clamp-2">{item.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center space-x-2">
                                                <Avatar className="h-6 w-6">
                                                    <AvatarImage src="https://placehold.co/24x24" alt={item.owner} />
                                                    <AvatarFallback className="text-xs">{item.owner[0]}</AvatarFallback>
                                                </Avatar>
                                                <span className="text-sm text-gray-600">{item.owner}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                                <span className="text-sm font-medium">{item.rating}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-1 text-gray-500">
                                                <Calendar className="h-4 w-4" />
                                                <span className="text-sm">Borrowed 12 times</span>
                                            </div>
                                            <Button size="sm">Request to Borrow</Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </main>
        </>
    )

    const renderMessagesSection = () => (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h2 className="text-3xl font-bold mb-6">Messages</h2>
            <Card>
                <CardContent className="p-8 text-center">
                    <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No messages yet</h3>
                    <p className="text-gray-600">When you borrow or lend tools, conversations will appear here.</p>
                </CardContent>
            </Card>
        </div>
    )

    const renderProfileSection = () => {
        const handleSave = () => {
            // Update user data in localStorage
            const updatedUser = { ...user, name: profileData.name }
            localStorage.setItem('user', JSON.stringify(updatedUser))
            setUser(updatedUser)
            setIsEditingProfile(false)
        }

        const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0]
            if (file) {
                const reader = new FileReader()
                reader.onloadend = () => {
                    setProfilePicture(reader.result as string)
                }
                reader.readAsDataURL(file)
            }
        }

        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold">Your Profile</h2>
                    <div className="flex space-x-2">
                        <Button
                            onClick={() => isEditingProfile ? handleSave() : setIsEditingProfile(true)}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            {isEditingProfile ? 'Save Changes' : 'Edit Profile'}
                        </Button>
                    </div>
                </div>
                <Card>
                    <CardHeader>
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <Avatar className="h-20 w-20">
                                    <AvatarImage src={profilePicture} alt={user.name || 'User'} />
                                    <AvatarFallback className="text-2xl">{user.name?.[0] || 'U'}</AvatarFallback>
                                </Avatar>
                                {isEditingProfile && (
                                    <label className="absolute bottom-0 right-0 bg-green-600 rounded-full p-1.5 cursor-pointer hover:bg-green-700 transition-colors">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageUpload}
                                        />
                                        <UserIcon className="h-3 w-3 text-white" />
                                    </label>
                                )}
                            </div>
                            <div className="flex-1">
                                {isEditingProfile ? (
                                    <div className="space-y-2">
                                        <Input
                                            value={profileData.name}
                                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                            placeholder="Your name"
                                            className="text-xl font-bold"
                                        />
                                        <Input
                                            value={profileData.email}
                                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                            placeholder="Email"
                                            type="email"
                                            disabled
                                            className="text-sm"
                                        />
                                    </div>
                                ) : (
                                    <div>
                                        <CardTitle className="text-2xl">{user.name || 'User'}</CardTitle>
                                        <CardDescription>{user.email}</CardDescription>
                                        <Badge className="mt-2">5 Tokens</Badge>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {isEditingProfile ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                                    <Input
                                        value={profileData.phone}
                                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                        placeholder="+1 234 567 8900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Location</label>
                                    <Input
                                        value={profileData.location}
                                        onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                                        placeholder="City, Country"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Bio</label>
                                    <Input
                                        value={profileData.bio}
                                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                        placeholder="Tell us about yourself..."
                                    />
                                </div>
                            </div>
                        ) : (
                            <>
                                <div>
                                    <h3 className="font-semibold mb-2">Your Items</h3>
                                    <p className="text-gray-600">You have 3 items listed</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">Reviews</h3>
                                    <div className="flex items-center space-x-2">
                                        <Star className="h-5 w-5 text-yellow-500 fill-current" />
                                        <span className="font-medium">4.8</span>
                                        <span className="text-gray-600">(12 reviews)</span>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">Member Since</h3>
                                    <p className="text-gray-600">December 2024</p>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        )
    }

    const renderListItemSection = () => (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h2 className="text-3xl font-bold mb-6">List a New Item</h2>
            <Card>
                <CardContent className="p-6">
                    <form className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Item Name</label>
                            <Input placeholder="e.g., Power Drill" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Description</label>
                            <Input placeholder="Describe your item..." />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Category</label>
                            <select className="w-full p-2 border rounded-md">
                                <option>Power Tools</option>
                                <option>Gardening</option>
                                <option>Kitchen</option>
                                <option>Equipment</option>
                                <option>Cleaning</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Upload Photo</label>
                            <Input type="file" />
                        </div>
                        <Button className="w-full bg-green-600 hover:bg-green-700">List Item</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-2">
                            <Wrench className="h-8 w-8 text-green-600" />
                            <span className="text-xl font-bold text-gray-900">Community Share</span>
                        </div>
                        <nav className="hidden md:flex items-center space-x-2">
                            <Button
                                variant={activeSection === 'home' ? "default" : "ghost"}
                                className="flex items-center space-x-2"
                                onClick={() => setActiveSection('home')}
                            >
                                <HomeIcon className="h-4 w-4" />
                                <span>Home</span>
                            </Button>
                            <Button
                                variant={activeSection === 'browse' ? "default" : "ghost"}
                                className="flex items-center space-x-2"
                                onClick={() => setActiveSection('browse')}
                            >
                                <Search className="h-4 w-4" />
                                <span>Browse</span>
                            </Button>
                            <Button
                                variant={activeSection === 'list-item' ? "default" : "ghost"}
                                className="flex items-center space-x-2"
                                onClick={() => setActiveSection('list-item')}
                            >
                                <Plus className="h-4 w-4" />
                                <span>List Item</span>
                            </Button>
                            <Button
                                variant={activeSection === 'messages' ? "default" : "ghost"}
                                className="flex items-center space-x-2"
                                onClick={() => setActiveSection('messages')}
                            >
                                <MessageCircle className="h-4 w-4" />
                                <span>Messages</span>
                            </Button>
                            {isAdmin && (
                                <Button
                                    variant={activeSection === 'admin' ? "default" : "ghost"}
                                    className="flex items-center space-x-2 border-l pl-4 ml-2"
                                    onClick={() => setActiveSection('admin')}
                                >
                                    <Wrench className="h-4 w-4 text-red-500" />
                                    <span className="text-red-600 font-bold">Admin</span>
                                </Button>
                            )}

                        </nav>
                        <div className="flex items-center space-x-4">
                            <Badge variant="secondary" className="flex items-center space-x-1">
                                <span className="text-yellow-600">⭐</span>
                                <span>5 Tokens</span>
                            </Badge>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Avatar className="cursor-pointer hover:ring-2 hover:ring-green-500 transition-all">
                                        <AvatarImage src="https://placehold.co/40x40" alt={user.name || 'User'} />
                                        <AvatarFallback>{user.name?.[0] || 'U'}</AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuLabel>
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium">{user.name || 'User'}</p>
                                            <p className="text-xs text-gray-500">{user.email}</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => setActiveSection('profile')} className="cursor-pointer">
                                        <UserIcon className="mr-2 h-4 w-4" />
                                        <span>Profile</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Logout</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content - renders based on activeSection */}
            {renderContent()}

            {/* Admin Modals */}
            {isEditModalOpen && itemToEdit && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
                    <Card className="w-full max-w-md shadow-2xl">
                        <CardHeader>
                            <CardTitle>Edit Item</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Title</label>
                                <Input
                                    value={itemToEdit.title}
                                    onChange={(e) => setItemToEdit({ ...itemToEdit, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Category</label>
                                <select
                                    className="w-full p-2 border rounded-md text-sm"
                                    value={itemToEdit.category}
                                    onChange={(e) => setItemToEdit({ ...itemToEdit, category: e.target.value })}
                                >
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <Input
                                    value={itemToEdit.description}
                                    onChange={(e) => setItemToEdit({ ...itemToEdit, description: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end space-x-2 pt-4">
                                <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                                <Button onClick={() => handleUpdateItem(itemToEdit.id, itemToEdit)}>Save Changes</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {isAdjustTokenModalOpen && userToAdjust && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
                    <Card className="w-full max-w-md shadow-2xl">
                        <CardHeader>
                            <CardTitle>Adjust Tokens for {userToAdjust.displayName}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex space-x-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium mb-1">Amount</label>
                                    <Input
                                        type="number"
                                        value={tokenAdjustment.amount}
                                        onChange={(e) => setTokenAdjustment({ ...tokenAdjustment, amount: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium mb-1">Type</label>
                                    <select
                                        className="w-full p-2 border rounded-md text-sm"
                                        value={tokenAdjustment.type}
                                        onChange={(e) => setTokenAdjustment({ ...tokenAdjustment, type: e.target.value })}
                                    >
                                        <option value="ADMIN_ADJUSTMENT">Adjustment (Add)</option>
                                        <option value="PENALTY">Penalty (Subtract)</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Reason</label>
                                <Input
                                    placeholder="Brief explanation..."
                                    value={tokenAdjustment.reason}
                                    onChange={(e) => setTokenAdjustment({ ...tokenAdjustment, reason: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end space-x-2 pt-4">
                                <Button variant="outline" onClick={() => setIsAdjustTokenModalOpen(false)}>Cancel</Button>
                                <Button className="bg-yellow-600 hover:bg-yellow-700 text-white" onClick={() => handleAdjustTokens(userToAdjust.id)}>Apply Adjustment</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}
