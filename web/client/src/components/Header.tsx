import React from 'react'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';
import { SvgIcon, Tooltip } from '@mui/material';
import AdbIcon from '@mui/icons-material/Adb';
import CorporateFare from '@mui/icons-material/CorporateFare';
import PersonnAdd from '@mui/icons-material/PersonAdd';
import UploadFile from '@mui/icons-material/UploadFile';
import { ClientContext } from '../context/clientContext';
import { ClientContextType } from '../@types/clientContextType';
import KeyVal from '../@types/Dictionary';
import { PersonAdd } from '@mui/icons-material';
import Icon from "@material-ui/core/Icon";

export default function Header() {
    const { setOpenMain, setOpenRegisterOrganization, setOpenEnrollUser, setOpenMintNFT } = React.useContext(ClientContext) as ClientContextType
    const pages: Array<KeyVal<string>> = [
        { Key: 'MAIN', Val: 'Main', Icon: CorporateFare },
        { Key: 'REGISTER', Val: 'Register Organization', Icon: CorporateFare },
        { Key: 'ENROLL', Val: 'Enroll User', Icon: PersonAdd },
        { Key: 'MINT', Val: 'Mint NFT', Icon: UploadFile }
    ]

    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null)

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    }

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    }

    const handleNavMenu = (key: string) => {
        switch (key) {
            case 'MAIN':
                setOpenMain(true)
                setOpenRegisterOrganization(false)
                setOpenEnrollUser(false)
                setOpenMintNFT(false)
                break
            case 'REGISTER':
                setOpenMain(false)
                setOpenRegisterOrganization(true)
                setOpenEnrollUser(false)
                setOpenMintNFT(false)
                break
            case 'ENROLL':
                setOpenMain(false)
                setOpenRegisterOrganization(false)
                setOpenEnrollUser(true)
                setOpenMintNFT(false)
                break
            case 'MINT':
                setOpenMain(false)
                setOpenRegisterOrganization(false)
                setOpenEnrollUser(false)
                setOpenMintNFT(true)
                break
        }
        handleCloseNavMenu();
    }


    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Box>
                        <Tooltip title="Open to select an option">
                            <IconButton
                                size="large"
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                sx={{ mr: 2 }}
                                onClick={handleOpenNavMenu}
                            >
                                <MenuIcon />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                        >
                            {pages.map((page) => (
                                <MenuItem key={page.Key} onClick={() => handleNavMenu(page.Key)}>
                                    {page.Val}
                                    {/* {page.Icon} */}
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <AdbIcon />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        NFT  Digital Asset Minting
                    </Typography>
                </Toolbar>
            </AppBar>
        </Box>
    )
}
