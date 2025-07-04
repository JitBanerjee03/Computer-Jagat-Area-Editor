import React from 'react'
import { Container, Typography, Box } from '@mui/material'

const About = () => {
    return (
        <Container sx={{ mt: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom>
                    About the Area Editor Portal
                </Typography>
                <Typography variant="body1" paragraph>
                    Welcome to the Area Editor Portal of our Journal Management System. This platform is designed to empower you in overseeing the peer review process, 
                    managing submissions in your specialized domain, and ensuring the publication of high-quality scholarly work.
                </Typography>
                <Typography variant="body1" paragraph>
                    As an Area Editor, you play a pivotal role in shaping the academic discourse within your field. This system provides you with comprehensive tools 
                    to handle manuscript assignments, coordinate with reviewers, make editorial recommendations, and maintain the scholarly standards of our journal.
                </Typography>
                <Typography variant="body1" paragraph>
                    Key features available to you as an Area Editor:
                </Typography>
                <ul>
                    <li>Manage all submissions within your designated subject area</li>
                    <li>Assign manuscripts to appropriate reviewers based on expertise</li>
                    <li>Monitor review progress and send reminders as needed</li>
                    <li>Evaluate reviewer feedback and make editorial decisions</li>
                    <li>Communicate directly with authors, reviewers, and chief editors</li>
                    <li>Track submission metrics and editorial timelines</li>
                    <li>Access historical data on previous submissions and decisions</li>
                    <li>Contribute to editorial policies and special issue planning</li>
                </ul>
                <Typography variant="body1" paragraph>
                    The system is designed to streamline your workflow, provide clear visibility of all active submissions, and support your critical role in maintaining 
                    the quality and integrity of our publication process.
                </Typography>
                <Typography variant="body1" paragraph>
                    We appreciate your leadership and expertise in guiding manuscripts through the review process and helping authors improve their work before publication.
                </Typography>
            </Box>
        </Container>
    )
}

export default About;